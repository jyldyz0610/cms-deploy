#!/bin/bash

echo "Resetting SQL DB:"
mysql -u root -p < sql_scripts/99_cleanup_db.sql

echo "Recreating DB/Table and inserting sample data"
mysql -u root -p < sql_scripts/01_setup_db.sql
mysql -u root -p < sql_scripts/02_setup_table.sql
mysql -u root -p < sql_scripts/03_insert_data.sql

