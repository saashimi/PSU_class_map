# PSU_class_map
An exercise in mapping classroom enrollments on the Portland State campus.
Hosted on gh-pages at [saashimi.github.io/PSU_class_map](https://saashimi.github.io/PSU_class_map).

## Synopsis
Portland State University’s Campus Planning Office is in the initial stages of preparing a Campus Circulation Plan. This plan will identify areas for future infrastructure improvement, investment, and analysis.  In this case, circulation is defined as on-campus pedestrian, bicycle, and delivery and utility vehicle movement patterns. However, we don't currently have a visual representation of class and student distributions throughout campus. My project addresses a portion of the pedestrian component by answering the following question: Where on campus are students located depending on the time of day and day of the week?  As a visual tool, I think this will aid fellow PSU Planners, Architects, and Facilities managers in prioritizing areas for further study.


## Data Pipeline
The dataset comes from our Banner Classroom Scheduling database, which can output to CSV.  For simplicity, I am examining Fall 2016 data, which is consistent with current planning methodology. Future iterations of this project can utilize multi-year and multi-term datasets.  For expediency, I have used python processing tools such as pandas to insert point coordinates for campus buildings based on the scheduled classrooms and for basic data preparation before switching to Javascript-based web mapping libraries.

## General Design
I've used mapboxgl for this map. 