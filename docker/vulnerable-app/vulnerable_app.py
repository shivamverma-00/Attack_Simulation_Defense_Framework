from flask import Flask, request, render_template_string, jsonify
import sqlite3
import hashlib
import os

app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT
        )
    ''')
    
    # Create posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Insert sample data
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@example.com')")
        cursor.execute("INSERT INTO users (username, password, email) VALUES ('user1', 'password123', 'user1@example.com')")
        cursor.execute("INSERT INTO posts (title, content, user_id) VALUES ('Welcome', 'This is a vulnerable application for testing', 1)")
        cursor.execute("INSERT INTO posts (title, content, user_id) VALUES ('Test Post', 'This is a test post', 2)")
    
    conn.commit()
    conn.close()

# Vulnerable login endpoint (SQL Injection)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        # VULNERABLE: Direct string concatenation
        query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
        
        try:
            conn = sqlite3.connect('vulnerable.db')
            cursor = conn.cursor()
            cursor.execute(query)
            user = cursor.fetchone()
            conn.close()
            
            if user:
                return jsonify({'success': True, 'message': f'Welcome {user[1]}!'})
            else:
                return jsonify({'success': False, 'message': 'Invalid credentials'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Error: {str(e)}'})
    
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable Login</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
                .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
                button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #0056b3; }
                .error { color: red; margin-top: 10px; }
                .success { color: green; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Vulnerable Login System</h2>
                <form method="POST">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div class="error">
                    <strong>Warning:</strong> This is a vulnerable application for educational purposes only!
                </div>
            </div>
        </body>
        </html>
    ''')

# Vulnerable search endpoint (XSS)
@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        query = request.form.get('query', '')
        
        # VULNERABLE: Direct output without escaping
        return render_template_string('''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Search Results</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .result { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .query { font-weight: bold; color: #007bff; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Search Results</h2>
                    <p>You searched for: <span class="query">{{ query }}</span></p>
                    <div class="result">
                        <h3>Sample Result 1</h3>
                        <p>This is a sample search result for your query.</p>
                    </div>
                    <div class="result">
                        <h3>Sample Result 2</h3>
                        <p>Another sample result that matches your search.</p>
                    </div>
                    <a href="/search">Back to Search</a>
                </div>
            </body>
            </html>
        ''', query=query)
    
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable Search</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
                .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
                button { width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #218838; }
                .error { color: red; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Vulnerable Search System</h2>
                <form method="POST">
                    <input type="text" name="query" placeholder="Enter search query" required>
                    <button type="submit">Search</button>
                </form>
                <div class="error">
                    <strong>Warning:</strong> This search is vulnerable to XSS attacks!
                </div>
            </div>
        </body>
        </html>
    ''')

# Vulnerable brute force endpoint
@app.route('/brute-force', methods=['GET', 'POST'])
def brute_force():
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        # Simulate login attempt
        conn = sqlite3.connect('vulnerable.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({'success': True, 'message': 'Login successful!'})
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials'})
    
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Brute Force Target</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
                .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
                button { width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; }
                button:hover { background: #c82333; }
                .error { color: red; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Brute Force Target</h2>
                <form method="POST">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                <div class="error">
                    <strong>Warning:</strong> This endpoint has no rate limiting or lockout protection!
                </div>
            </div>
        </body>
        </html>
    ''')

# API endpoints for testing
@app.route('/api/users')
def api_users():
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email FROM users")
    users = cursor.fetchall()
    conn.close()
    
    return jsonify([{'id': u[0], 'username': u[1], 'email': u[2]} for u in users])

@app.route('/api/posts')
def api_posts():
    conn = sqlite3.connect('vulnerable.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content FROM posts")
    posts = cursor.fetchall()
    conn.close()
    
    return jsonify([{'id': p[0], 'title': p[1], 'content': p[2]} for p in posts])

@app.route('/')
def index():
    return render_template_string('''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable Application</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                .warning { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                a { color: #007bff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Vulnerable Application for Testing</h1>
                <div class="warning">
                    <strong>⚠️ WARNING:</strong> This application is intentionally vulnerable for educational and testing purposes only. 
                    Do not use in production environments!
                </div>
                
                <h2>Available Endpoints:</h2>
                
                <div class="endpoint">
                    <h3>🔴 SQL Injection Target</h3>
                    <p>Test SQL injection attacks against the login system.</p>
                    <a href="/login">/login</a>
                </div>
                
                <div class="endpoint">
                    <h3>🌐 XSS Target</h3>
                    <p>Test cross-site scripting attacks through the search functionality.</p>
                    <a href="/search">/search</a>
                </div>
                
                <div class="endpoint">
                    <h3>🔨 Brute Force Target</h3>
                    <p>Test brute force attacks against the login system (no rate limiting).</p>
                    <a href="/brute-force">/brute-force</a>
                </div>
                
                <div class="endpoint">
                    <h3>📊 API Endpoints</h3>
                    <p>REST API endpoints for automated testing.</p>
                    <a href="/api/users">/api/users</a> | 
                    <a href="/api/posts">/api/posts</a>
                </div>
                
                <h2>Sample Credentials:</h2>
                <ul>
                    <li>Username: admin, Password: admin123</li>
                    <li>Username: user1, Password: password123</li>
                </ul>
            </div>
        </body>
        </html>
    ''')

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=8080, debug=True)


