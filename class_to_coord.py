#Import required packages
import pandas as pd
import numpy as np
import datetime
import os

def format_date(df_date):
    """
    Splits Meeting Times and Dates into datetime objects where applicable using 
    regex. Adds separate columns for days of the weeks to facilitate separate 
    csv file generation. 
    """
    df_date['Days'] = df_date['Meeting_Times'].str.extract('([^\s]+)', expand=True).astype(str)
    df_date['Start_Date'] = df_date['Meeting_Dates'].str.extract('([^\s]+)', expand=True)
    df_date['End_Date'] = df_date['Meeting_Dates'].str.extract('(?<=-)(.*)(?= )', expand=True)
    df_date['Start_Time'] = df_date['Meeting_Times'].str.extract('(?<= )(.*)(?=-)', expand=True).astype(str)
    df_date['End_Time'] = df_date['Meeting_Times'].str.extract('((?<=-).*$)', expand=True).astype(str)
    df_date['Building'] =  df_date['ROOM'].str.extract('([^\s]+)', expand=True).astype(str)

    for index, row in df_date.iterrows():
        try:
            df_date.loc[index, 'Start_Time'] = int(row['Start_Time'][0:2])
            df_date.loc[index, 'End_Time'] = int(row['End_Time'][0:2])
        except:
            continue
   
    return df_date


def save_to_csv(df_final):
    """
    Simplifies data file by saving only pertinent data
    """
    df_final = df_final.loc[
        (df_final['Latitude'] != None) &
        (df_final['Longitude'] != None) &
        (df_final['Actual_Enrl'] > 0)]
    columns = ['Building', 'Actual_Enrl', 'Latitude', 'Longitude', 'Days', 'Start_Time', 'End_Time']
    agg_operations = ({'Actual_Enrl' : 'sum',
                          'Latitude' : 'max',
                          'Longitude' : 'max'})
    df_final = df_final.groupby(['Building', 'Start_Time', 'End_Time', 'Days'], as_index=False).agg(agg_operations)
    df_final.to_csv('full_sched.csv', columns=columns)


def join_coords(df_proc):
    filename = 'map_input/bldg_pt.csv'
    df_new = pd.read_csv(os.path.join(os.path.dirname(__file__), filename))
    df_coord = pd.merge(df_proc, df_new, left_on='Building', right_on='BUILDINGID', how='left')
    return df_coord

def main():
    """
    main program control.
    """
    pd.set_option('display.max_rows', None)  
    filename = 'map_input/PSU_master_classroom.csv'
    df = pd.read_csv(os.path.join(os.path.dirname(__file__), filename), dtype={'Schedule': object, 'Schedule Desc': object})   
    df = df.fillna('')

    terms = [201604]
    df = df.loc[df['Term'].isin(terms)]

    df = format_date(df)

    df = join_coords(df)

    # Avoid classes that only occur on a single day
    df = df.loc[df['Start_Date'] != df['End_Date']]
    df = df.loc[df['Online Instruct Method'] != 'Fully Online']
    save_to_csv(df)

if __name__ == '__main__':
    main()

