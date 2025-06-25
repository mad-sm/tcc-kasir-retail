FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# Ini sangat penting agar folder /app/db bisa ditulis
RUN chmod -R 777 /app/db

EXPOSE 5000
CMD ["python", "app.py"]
