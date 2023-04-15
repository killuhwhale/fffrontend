# !/bin/sh
# - start the docker container
# - reset the database
# - run the test detox command
#     - Add create user test.

docker compose -f /home/killuh/ws_p38/fitform/instafitAPI/docker-compose.yml down -v
sudo rm -r /home/killuh/ws_p38/fitform/instafitAPI/data/db
docker compose  -f /home/killuh/ws_p38/fitform/instafitAPI/docker-compose.yml up &
sleep 20
docker compose -f /home/killuh/ws_p38/fitform/instafitAPI/docker-compose.yml exec instafitapi bash migrate_create.sh
# docker compose -f /home/killuh/ws_p38/fitform/instafitAPI/docker-compose.yml exec instafitapi python3 manage.py makemigrations
kill $(lsof -t -i  :8081)
npx react-native start &
TEST_SCRIPT=1 detox test --configuration android.emu.debug

kill $(lsof -t -i  :8081)
docker compose -f /home/killuh/ws_p38/fitform/instafitAPI/docker-compose.yml down -v