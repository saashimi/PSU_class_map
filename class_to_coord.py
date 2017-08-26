#Import required packages
import pandas as pd
import numpy as np
import datetime
import os

def split_time(df_time):
    """
    Splits Meeting Times and Dates into separate columns.
    """
    df_time['Days'] = df_time['Meeting_Times'].str.extract('([^\s]+)', expand=True).astype(str)
    df_time['Start_Date'] = df_time['Meeting_Dates'].str.extract('([^\s]+)', expand=True)
    df_time['End_Date'] = df_time['Meeting_Dates'].str.extract('(?<=-)(.*)(?= )', expand=True)
    df_time['Start_Time'] = df_time['Meeting_Times'].str.extract('(?<= )(.*)(?=-)', expand=True).astype(str)
    df_time['End_Time'] = df_time['Meeting_Times'].str.extract('((?<=-).*$)', expand=True).astype(str)
    df_time['Building'] =  df_time['ROOM'].str.extract('([^\s]+)', expand=True).astype(str)

    for index, row in df_time.iterrows():
        try:
            start = int(row['Start_Time'][0:2])
            end = int(row['End_Time'][0:2])
            time_array = str(list(range(start, end+1)))
            df_time.loc[index, 'Time_Range'] = time_array          
        except:
            df_time.drop(index, inplace=True)
            continue 

        time_array = list(range(start, end+1))
        class_hr_range = list(range(6, 24))

        for class_hr in class_hr_range:
            for sched_hr in time_array:
                if sched_hr == class_hr:
                    df_time.loc[index, 'Hr_{0}'.format(str(sched_hr))] = False
                else:
                    df_time.loc[index, 'Hr_{0}'.format(str(sched_hr))] = True
    #df_time.to_csv('test_sched.csv')
    return df_time

def group_hour(df_all_hours):
    """
    Loops through every Hr column and groups by hour; output is a final combined
    dataframe.
    """
    # an empty dataframe:
    df_by_hr = pd.DataFrame()
    group_hours = list(range(6, 24))
    for hr in group_hours:
        agg_hr_operations = ({'Actual_Enrl' : 'sum',
                              'Days' : 'max'})
        df_temp = df_all_hours.groupby(['Building', 'Hr_{0}'.format(str(hr))], as_index=False).agg(agg_hr_operations)
        df_by_hr = df_by_hr.append(df_temp, ignore_index = True)
    
    return df_by_hr

def join_coords(df_proc):
    """
    Join Lat/Long Coordinates to Building column.
    """
    filename = 'map_input/bldg_pt.csv'
    df_new = pd.read_csv(os.path.join(os.path.dirname(__file__), filename))
    df_coord = pd.merge(df_proc, df_new, left_on='Building', right_on='BUILDINGID', how='left')
    return df_coord

def split_days(df_days):
    """
    Separates days into respective columns
    """
    df_days = df_days.loc[
        (df_days['Latitude'] != None) &
        (df_days['Longitude'] != None) &
        (df_days['Actual_Enrl'] > 0)]
    
    """
    agg_operations = ({'Actual_Enrl' : 'sum',
                       'Latitude' : 'max',
                       'Longitude' : 'max'})
    df_days = df_days.groupby(['Days'], as_index=False).agg(agg_operations)
    """
    days = ['M', 'T', 'W', 'R', 'F', 'S', 'U']
    for index, row in df_days.iterrows():
        for day in row['Days']:
            for match_day in days: # e.g. MWF in the string
                try:
                    if day == match_day:
                        df_days.loc[index, 'Day_{0}'.format(day)] = False
                    else:
                        df_days.loc[index, 'Day_{0}'.format(day)] = True
                except:
                    continue
    #df_days.to_csv('test_group_days.csv')
    return df_days

def save_to_csv(df_final):
    """
    Simplifies data file by saving only pertinent data
    """   
    columns = ['Building', 'Actual_Enrl', 'Latitude', 'Longitude']
    day_cols = [col for col in df_final.columns if 'Day' in col]
    for col in day_cols:
        columns.append(col) 
    class_hr_cols = [col for col in df_final.columns if 'Hr' in col]
    for col in class_hr_cols:
        columns.append(col)
    df_final.to_csv('full_sched.csv', columns=columns)

def main():
    """
    main program control.
    """
    pd.set_option('display.max_rows', None)  
    filename = 'map_input/PSU_master_classroom.csv'
    df = pd.read_csv(os.path.join(os.path.dirname(__file__), filename), dtype={'Schedule': object, 'Schedule Desc': object})   
    df = df.fillna('')
    # Avoid classes that only occur on a single day
    #df = df.loc[df['Start_Date'] != df['End_Date']]
    df = df.loc[df['Online Instruct Method'] != 'Fully Online']
    # Limit to Fall 2016
    terms = [201604]
    
    df = df.loc[df['Term'].isin(terms)]
    df = split_time(df)
    df = group_hour(df)
    df = join_coords(df)
    df = split_days(df)
    save_to_csv(df)

if __name__ == '__main__':
    main()

