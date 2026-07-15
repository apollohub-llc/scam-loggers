from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/log', methods=['POST'])
def log_data():
    try:
        # Get the JSON data sent from your phone
        data = request.get_json()
        if data:
            # Process and log the data
            print(f"Received data: {data}")
            # Here you can save the data, log it, or trigger actions
            return jsonify({"status": "success", "message": "Data received"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    return jsonify({"status": "error", "message": "No data received"}), 400