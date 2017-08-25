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

    """
    class_hr_range = list(range(0, 24))
    for hr in class_hr_range:
        df_date[hr] = None
    """

    for index, row in df_date.iterrows():

        try:
            start = int(row['Start_Time'][0:2])
            end = int(row['End_Time'][0:2])
            time_array = str(list(range(start, end+1)))
            df_date.loc[index, 'Time_Range'] = time_array          

        except:
            df_date.drop(index, inplace=True)
            continue 
    #df_date.to_csv('full_sched.csv')

    return df_date


def save_to_csv(df_final):
    """
    Simplifies data file by saving only pertinent data
    """   
    df_final = df_final.loc[
        (df_final['Latitude'] != None) &
        (df_final['Longitude'] != None) &
        (df_final['Actual_Enrl'] > 0)]
    agg_operations = ({'Actual_Enrl' : 'sum',
                       'Latitude' : 'max',
                       'Longitude' : 'max'})
    df_final = df_final.groupby(['Building', 'Start_Time', 'End_Time', 'Days', 'Time_Range'], as_index=False).agg(agg_operations)
    days = ['M', 'T', 'W', 'R', 'F', 'S', 'U']
    for index, row in df_final.iterrows():
        for day in row['Days']:
            for match_day in days: # e.g. MWF in the string
                try:
                    if day == match_day:
                        df_final.loc[index, 'Day_{0}'.format(day)] = False
                    else:
                        df_final.loc[index, 'Day_{0}'.format(day)] = True
                except:
                    continue


    for index, row in df_final.iterrows():
        start = int(row['Start_Time'][0:2])
        end = int(row['End_Time'][0:2])
        time_array = list(range(start, end+1))
        class_hr_range = list(range(6, 24))

        for class_hr in class_hr_range:
            for sched_hr in time_array:
                if sched_hr == class_hr:
                    df_final.loc[index, 'Hr_{0}'.format(str(sched_hr))] = False
                else:
                    df_final.loc[index, 'Hr_{0}'.format(str(sched_hr))] = True

    columns = ['Building', 'Actual_Enrl', 'Latitude', 'Longitude', 'Start_Time', 'End_Time', 'Time_Range']
    day_cols = [col for col in df_final.columns if 'Day' in col]
    for col in day_cols:
        columns.append(col) 
    class_hr_cols = [col for col in df_final.columns if 'Hr' in col]
    for col in class_hr_cols:
        columns.append(col)
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

