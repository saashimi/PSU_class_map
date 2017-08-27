#Import required packages
import pandas as pd
import numpy as np
import datetime
import os

def split_cols(df_datetime):
    """
    Splits Meeting Times and Days into separate columns.
    """
    df_datetime['Days'] = df_datetime['Meeting_Times'].str.extract('([^\s]+)', expand=True).astype(str)
    df_datetime['Start_Date'] = df_datetime['Meeting_Dates'].str.extract('([^\s]+)', expand=True)
    df_datetime['End_Date'] = df_datetime['Meeting_Dates'].str.extract('(?<=-)(.*)(?= )', expand=True)
    df_datetime['Start_Time'] = df_datetime['Meeting_Times'].str.extract('(?<= )(.*)(?=-)', expand=True).astype(str)
    df_datetime['End_Time'] = df_datetime['Meeting_Times'].str.extract('((?<=-).*$)', expand=True).astype(str)
    df_datetime['Building'] =  df_datetime['ROOM'].str.extract('([^\s]+)', expand=True).astype(str)

    for index, row in df_datetime.iterrows():
        try:
            start = int(row['Start_Time'][0:2])
            end = int(row['End_Time'][0:2])
            time_array = str(list(range(start, end+1)))
            df_datetime.loc[index, 'Time_Range'] = time_array          
        except:
            df_datetime.drop(index, inplace=True)
            continue 

        time_array = list(range(start, end+1))
        class_hr_range = list(range(6, 24))

        for class_hr in class_hr_range:
            for sched_hr in time_array:
                if sched_hr == class_hr:
                    df_datetime.loc[index, 'Hr_{0}'.format(str(sched_hr))] = False
                else:
                    df_datetime.loc[index, 'Hr_{0}'.format(str(sched_hr))] = True
    
    days = ['M', 'T', 'W', 'R', 'F', 'S', 'U']
    for index, row in df_datetime.iterrows():
        for day in row['Days']:
            for match_day in days: # e.g. MWF in the string
                try:
                    if day == match_day:
                        df_datetime.loc[index, 'Day_{0}'.format(day)] = False
                    else:
                        df_datetime.loc[index, 'Day_{0}'.format(day)] = True
                except:
                    print('error')
                    continue


    df_datetime.to_csv('test_sched.csv')
    return df_datetime

def group_date_time(df_all_cols):
    """
    Loops through every Day and Hr column and groups by day/hour; output is a 
    final combined dataframe.
    """
    # an empty dataframe:
    df_by_hr_day = pd.DataFrame()
    group_date_times = list(range(6, 24))
    days = ['M', 'T', 'W', 'R', 'F', 'S', 'U']
    for day in days:

        for hr in group_date_times:
            agg_hr_operations = ({'Actual_Enrl' : 'sum'})
            df_temp = df_all_cols.groupby(['Building', 'Hr_{0}'.format(str(hr)), 'Day_{0}'.format(day)], as_index=False).agg(agg_hr_operations)
            df_by_hr_day = df_by_hr_day.append(df_temp, ignore_index = True)
    
    return df_by_hr_day

def join_coords(df_proc):
    """
    Join Lat/Long Coordinates to Building column.
    """
    filename = 'map_input/bldg_pt.csv'
    df_new = pd.read_csv(os.path.join(os.path.dirname(__file__), filename))
    df_coord = pd.merge(df_proc, df_new, left_on='Building', right_on='BUILDINGID', how='left')
    return df_coord

def save_to_csv(df_final):
    """
    Simplifies data file by saving only pertinent data
    """   
    df_final = df_final.loc[df_final['Actual_Enrl'] > 0]
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
    df = df.loc[df['Online Instruct Method'] != 'Fully Online']
    # Limit to Fall 2016
    terms = [201604]
    
    
    df = df.loc[df['Term'].isin(terms)]
    df = split_cols(df)
    df = group_date_time(df)
    df = join_coords(df)
    #df = split_days(df)
    save_to_csv(df) 

if __name__ == '__main__':
    main()

