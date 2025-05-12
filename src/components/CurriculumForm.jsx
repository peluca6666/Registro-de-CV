import { useState, useEffect, useRef } from 'react';
import styles from './CurriculumForm.module.css';

function CurriculumForm({ formData, onAgregar, onCancel, modoEdicion = false }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    educacion: [{ id: generarId(), titulo: "", institucion: "", anio: "", nivelEducativo: "" }],
    experiencia: [{
      id: generarId(),
      empleador: "",
      cargo: "",
      fechaInicio: "",
      fechaFin: "",
      responsabilidades: ""
    }]
  });

  const fileInputRef = useRef(null);

  // Cargar datos del formulario en modo edición
  useEffect(() => {
    if (modoEdicion && formData) {
      setForm(formData);
    }
  }, [modoEdicion, formData]);

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          imagen: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar imagen
  const eliminarImagen = () => {
    setForm(prev => ({ ...prev, imagen: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Manejo genérico de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de cambios en los arrays de la educación y experiencia
  const handleArrayChange = (arrayName, id, e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map(item => 
        item.id === id ? { ...item, [name]: value } : item
      )
    }));
  };

  // Agregar nuevos items a arrays
  const agregarItem = (arrayName, template) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template, id: generarId() }]
    }));
  };

  // Eliminar items de arrays
  const eliminarItem = (arrayName, id) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== id)
    }));
  };

  // Plantillas para items nuevos
  const plantillas = {
    educacion: { titulo: "", institucion: "", anio: "", nivelEducativo: "" },
    experiencia: { empleador: "", cargo: "", fechaInicio: "", fechaFin: "", responsabilidades: "" }
  };

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregar({
      ...form,
      id: modoEdicion ? form.id : generarId()
    });
  
    // Resetear el formulario
    setForm({
      nombre: "",
      email: "",
      telefono: "",
      imagen: null,
      educacion: [{ id: generarId(), titulo: "", institucion: "", anio: "", nivelEducativo: "" }],
      experiencia: [{
        id: generarId(),
        empleador: "",
        cargo: "",
        fechaInicio: "",
        fechaFin: "",
        responsabilidades: ""
      }]
    });
  
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <fieldset className={styles.formSection}>
        <legend>Foto de Perfil</legend>
        <div className={styles.imageUploadContainer}>
          {form.imagen ? (
            <div className={styles.imagePreviewContainer}>
              <img 
                src={form.imagen} 
                alt="Preview" 
                className={styles.imagePreview}
              />
              <button 
                type="button" 
                onClick={eliminarImagen}
                className={styles.deleteImageBtn}
              >
                Eliminar Imagen
              </button>
            </div>
          ) : (
            <div className={styles.imageUploadArea}>
              <label className={styles.imageUploadLabel}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <span className={styles.uploadText}>+ Seleccionar Imagen</span>
                <small>(Formatos: JPG, PNG. Máx. 2MB)</small>
              </label>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.formSection}>
        <legend>Información Personal</legend>
        <InputField label="Nombre completo" name="nombre" value={form.nombre} onChange={handleChange} required />
        <InputField type="email" label="Email" name="email" value={form.email} onChange={handleChange} required />
        <InputField type="tel" label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} required />
      </fieldset>

      <fieldset className={styles.formSection}>
        <legend>Educación</legend>
        {form.educacion.map(edu => (
          <div key={edu.id} className={styles.arrayItem}>
            <InputField 
              label="Título" 
              name="titulo" 
              value={edu.titulo} 
              onChange={(e) => handleArrayChange('educacion', edu.id, e)} 
              required 
            />
            <InputField 
              label="Institución" 
              name="institucion" 
              value={edu.institucion} 
              onChange={(e) => handleArrayChange('educacion', edu.id, e)} 
              required 
            />
            <InputField 
              label="Año" 
              name="anio" 
              value={edu.anio} 
              onChange={(e) => handleArrayChange('educacion', edu.id, e)} 
              required 
            />

            <div className={styles.selectField}>
              <label>Nivel Educativo</label>
              <select
                name="nivelEducativo"
                value={edu.nivelEducativo || ""}
                onChange={(e) => handleArrayChange('educacion', edu.id, e)}
                className={styles.selectInput}
                required
              >
                <option value="">Seleccione el nivel educativo</option>
                <option value="secundarioCompleto">Secundario completo</option>
                <option value="terciarioEnCurso">Terciario en curso</option>
                <option value="terciarioCompleto">Terciario completo</option>
                <option value="universitarioEnCurso">Universitario en curso</option>
                <option value="universitarioCompleto">Universitario completo</option>
              </select>
            </div>

            <button 
              type="button" 
              onClick={() => eliminarItem('educacion', edu.id)} 
              className={styles.deleteBtn}
            >
              Cerrar
            </button>
          </div>
        ))}

        <button type="button" onClick={() => agregarItem('educacion', plantillas.educacion)} className={styles.addBtn}>
          + Agregar Educación
        </button>
      </fieldset>

      <fieldset className={styles.formSection}>
        <legend>Experiencia Laboral</legend>
        {form.experiencia.map(exp => (
          <div key={exp.id} className={styles.arrayItem}>
            <InputField label="Empleador" name="empleador" value={exp.empleador} 
              onChange={(e) => handleArrayChange('experiencia', exp.id, e)} required />
            <InputField label="Cargo" name="cargo" value={exp.cargo} 
              onChange={(e) => handleArrayChange('experiencia', exp.id, e)} required />
            <div className={styles.dateFields}>
              <InputField type="date" label="Fecha Inicio" name="fechaInicio" value={exp.fechaInicio} 
                onChange={(e) => handleArrayChange('experiencia', exp.id, e)} required />
              <InputField type="date" label="Fecha Fin" name="fechaFin" value={exp.fechaFin} 
                onChange={(e) => handleArrayChange('experiencia', exp.id, e)} />
            </div>
            <TextArea label="Responsabilidades" name="responsabilidades" value={exp.responsabilidades} 
              onChange={(e) => handleArrayChange('experiencia', exp.id, e)} />
            <button type="button" onClick={() => eliminarItem('experiencia', exp.id)} className={styles.deleteBtn}>
              Cerrar
            </button>
          </div>
        ))}
        <button type="button" onClick={() => agregarItem('experiencia', plantillas.experiencia)} className={styles.addBtn}>
          + Agregar Experiencia
        </button>
      </fieldset>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn}>
          {modoEdicion ? 'Actualizar Currículum' : 'Guardar Currículum'}
        </button>
        {modoEdicion && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// Componente Input reutilizable
const InputField = ({ type = "text", label, name, value, onChange, required }) => (
  <div className={styles.inputField}>
    <label>
      {label}
      <input type={type} name={name} value={value} onChange={onChange} required={required} />
    </label>
  </div>
);

// Componente TextArea reutilizable
const TextArea = ({ label, name, value, onChange }) => (
  <div className={styles.inputField}>
    <label>
      {label}
      <textarea name={name} value={value} onChange={onChange} rows={3} />
    </label>
  </div>
);

// Función para generar IDs únicos
const generarId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

export default CurriculumForm;