cmake_minimum_required(VERSION 3.2)

project(graph-generator)
add_executable(${PROJECT_NAME} "main.cpp" "plot.r")
set_target_properties(${PROJECT_NAME} PROPERTIES
            CXX_STANDARD 17
            CXX_EXTENSIONS OFF
            )
target_link_libraries(${PROJECT_NAME} stdc++fs)
