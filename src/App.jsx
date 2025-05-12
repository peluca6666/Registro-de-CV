import { useState, useEffect } from 'react';
import CurriculumForm from './components/curriculumForm';
import CurriculumList from './components/curriculumList';
import CurriculumDetail from './components/CurriculumDetail';

/* Función para generar IDs unicos
 Lo hacemos con Date.now() y Math.random()*/
const generarId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

function App() {
  const [curriculums, setCurriculums] = useState([]);
  const [curriculumSeleccionado, setCurriculumSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  /* Se cargan los datos al inicializar el componente
   Se verifica si hay curriculums guardados en localStorage
   Si hay, se parsean y se asignan al estado*/
  useEffect(() => {
    const guardados = localStorage.getItem("curriculums");
    if (guardados) {
      const parsed = JSON.parse(guardados);
      const conIds = parsed.map(c => ({
        ...c,
        id: c.id || generarId(),
        educacion: c.educacion?.map(edu => ({
          ...edu,
          id: edu.id || generarId()
        })) || [],
        experiencia: c.experiencia?.map(exp => ({
          ...exp,
          id: exp.id || generarId()
        })) || []
      }));
      setCurriculums(conIds);
    }
  }, []);
  
  // Funcion para agregar curriculum
  const agregarCurriculum = (nuevoCurriculum) => {
    setCurriculums((prevCurriculums) => {
      const actualizados = [...prevCurriculums, nuevoCurriculum];
      localStorage.setItem("curriculums", JSON.stringify(actualizados));
      return actualizados;
    });
  };

  // Funcio n para actualizar el curriculum
  const actualizarCurriculum = (curriculumActualizado) => {
    setCurriculums(prev => {
      const actualizados = prev.map(curriculum => 
        curriculum.id === curriculumActualizado.id ? curriculumActualizado : curriculum
      );
      localStorage.setItem("curriculums", JSON.stringify(actualizados));
      return actualizados;
    });
    setCurriculumSeleccionado(curriculumActualizado);
    setModoEdicion(false);
  };

  const eliminarCurriculum = (id) => {
    setCurriculums(prev => {
      const actualizados = prev.filter(curriculum => curriculum.id !== id);
      localStorage.setItem("curriculums", JSON.stringify(actualizados));
      return actualizados;
    });

    // Si eliminamos el curriculum seleccionado, lo limpiamos
    if (curriculumSeleccionado && curriculumSeleccionado.id === id) {
      setCurriculumSeleccionado(null);
    }
  };

  const verDetalle = (curriculum) => {
    setCurriculumSeleccionado(curriculum);
    setModoEdicion(false);
  };

  const iniciarEdicion = () => {
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
      padding: '30px 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
        fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif"
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#2c3e50',
          fontSize: '2.2rem',
          fontWeight: '600',
          position: 'relative',
          paddingBottom: '15px'
        }}>
          Registro de currículums
          <span style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '2px',
            background: 'black',
          }}></span>
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px' 
        }}>
          <div>
            {!modoEdicion ? (
              <>
                <CurriculumForm onAgregar={agregarCurriculum} />
                <CurriculumList 
                  curriculums={curriculums} 
                  onVerDetalle={verDetalle}
                  onEliminar={eliminarCurriculum}
                />
              </>
            ) : (
              <div style={{ 
                marginBottom: '20px',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <h2 style={{ color: '#4361ee', marginBottom: '15px' }}>Editando currículum</h2>
                <CurriculumForm 
                  formData={curriculumSeleccionado}
                  onAgregar={actualizarCurriculum} 
                  onCancel={cancelarEdicion}
                  modoEdicion={true}
                />
              </div>
            )}
          </div>
          
          <div style={{ 
            position: 'sticky', 
            top: '20px', 
            alignSelf: 'start',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            {curriculumSeleccionado ? (
              <CurriculumDetail 
                curriculum={curriculumSeleccionado} 
                onClose={() => setCurriculumSeleccionado(null)}
                onEdit={iniciarEdicion}
              />
            ) : (
              <div style={{ 
                padding: '30px', 
                border: '2px dashed #e0e0e0', 
                textAlign: 'center',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ 
                  color: '#666',
                  fontSize: '1rem',
                  margin: '0'
                }}>
                  Selecciona un currículum para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;