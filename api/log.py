from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['POST'])
def log_data():
    try:
        data = request.get_json()
        if data:
            print(f"Received: {data}")
            # TODO: Save to a database or log file
            return jsonify({"status": "ok"}), 200
        return jsonify({"status": "error", "message": "No data"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Vercel expects the app instance to be named 'app'
# If you have a different name, Vercel won't find it.