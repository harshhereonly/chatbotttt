from datetime import datetime
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

database_url = os.environ.get('DATABASE_URL', 'sqlite:///leads.db')
# Fix for Render PostgreSQL URL (they use postgres:// but SQLAlchemy needs postgresql://)
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')


class Lead(db.Model):
    __tablename__ = 'leads'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    regarding = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.String(50), nullable=False)


with app.app_context():
    db.create_all()


@app.route('/api/admin/auth', methods=['POST'])
def admin_auth():
    payload = request.get_json(silent=True) or {}
    password = payload.get('password', '').strip()
    if not password:
        return jsonify({'success': False, 'message': 'Password is required.'}), 400
    if password == ADMIN_PASSWORD:
        return jsonify({
            'success': True,
            'message': 'Authentication successful',
            'token': 'admin_token_' + str(datetime.utcnow().timestamp())
        }), 200
    return jsonify({'success': False, 'message': 'Invalid password.'}), 401


@app.route('/api/leads', methods=['POST'])
def save_lead():
    payload = request.get_json(silent=True) or {}
    name = (payload.get('name') or '').strip()
    phone = (payload.get('phone') or '').strip()
    email = (payload.get('email') or '').strip()
    regarding = (payload.get('regarding') or '').strip()

    if not name or not phone or not regarding:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

    lead = Lead(
        name=name, phone=phone, email=email,
        regarding=regarding,
        created_at=datetime.utcnow().isoformat(sep=' ', timespec='seconds')
    )
    db.session.add(lead)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Lead saved'})


@app.route('/api/leads', methods=['GET'])
def list_leads():
    leads = Lead.query.order_by(Lead.created_at.desc()).all()
    return jsonify({'success': True, 'leads': [{
        'id': l.id, 'name': l.name, 'phone': l.phone,
        'email': l.email, 'regarding': l.regarding,
        'created_at': l.created_at
    } for l in leads]})


@app.route('/api/leads/<int:lead_id>', methods=['PUT'])
def update_lead(lead_id):
    lead = Lead.query.get(lead_id)
    if not lead:
        return jsonify({'success': False, 'message': 'Lead not found.'}), 404

    payload = request.get_json(silent=True) or {}
    lead.name = (payload.get('name') or '').strip()
    lead.phone = (payload.get('phone') or '').strip()
    lead.email = (payload.get('email') or '').strip()
    lead.regarding = (payload.get('regarding') or '').strip()

    if not lead.name or not lead.phone or not lead.regarding:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400

    db.session.commit()
    return jsonify({'success': True, 'message': 'Lead updated'})


@app.route('/api/leads/<int:lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    lead = Lead.query.get(lead_id)
    if not lead:
        return jsonify({'success': False, 'message': 'Lead not found.'}), 404
    db.session.delete(lead)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Lead deleted'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)