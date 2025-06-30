from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'secret'
db = SQLAlchemy(app)

class Persona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(30), unique=True, nullable=False)

class PersonaForm(FlaskForm):
    nombre = StringField('Nombre de usuario', validators=[DataRequired(), Length(max=100)])
    correo = StringField('Correo electrónico', validators=[DataRequired(), Length(max=30)])
    submit = SubmitField('Guardar')

# Rutas
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register')
def index():
    personas = Persona.query.all()
    return render_template('index.html', personas=personas)

@app.route('/add', methods=['GET', 'POST'])
def add():
    form = PersonaForm()
    if form.validate_on_submit():
        nueva_persona = Persona(
            nombre=form.nombre.data,
            correo=form.correo.data
        )
        db.session.add(nueva_persona)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('form.html', form=form)

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    persona = Persona.query.get_or_404(id)
    form = PersonaForm(obj=persona)
    if form.validate_on_submit():
        persona.nombre = form.nombre.data
        persona.correo = form.correo.data
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('form.html', form=form)

@app.route('/delete/<int:id>')
def delete(id):
    persona = Persona.query.get_or_404(id)
    db.session.delete(persona)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/credits')
def credits():
    return render_template('credits.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)