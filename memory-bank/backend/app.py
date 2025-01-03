from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the front end

# Configuration
UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///memories.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Initialize the database
db = SQLAlchemy(app)

# Define the Memory model
class Memory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=True)
    image_filename = db.Column(db.String(255), nullable=False)

# Create the database
with app.app_context():
    db.create_all()

# Helper function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to upload a memory
@app.route('/upload', methods=['POST'])
def upload_memory():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    description = request.form.get('description', '')

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(filepath)

        # Save to the database
        new_memory = Memory(description=description, image_filename=filename)
        db.session.add(new_memory)
        db.session.commit()

        return jsonify({'message': 'Memory uploaded successfully'}), 201

    return jsonify({'error': 'Invalid file type'}), 400

# Route to fetch all memories
@app.route('/memories', methods=['GET'])
def get_memories():
    memories = Memory.query.all()
    return jsonify([
        {
            'id': memory.id,
            'description': memory.description,
            'image_filename': memory.image_filename,
        }
        for memory in memories
    ])

# Route to serve uploaded images
@app.route('/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
