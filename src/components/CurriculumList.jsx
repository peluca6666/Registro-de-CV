import React, { useState, useEffect } from 'react';
import styles from './CurriculumList.module.css';

// Función para traducir niveles educativos
const traducirNivelEducativo = (valor) => {
  const traducciones = {
    secundarioCompleto: "Secundario completo",
    terciarioEnCurso: "Terciario en curso",
    terciarioCompleto: "Terciario completo",
    universitarioEnCurso: "Universitario en curso",
    universitarioCompleto: "Universitario completo"
  };

  return traducciones[valor] || valor;
};

function CurriculumList({ curriculums: curriculumsProp, onVerDetalle, onEliminar }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [nivelEducativoFiltro, setNivelEducativoFiltro] = useState('');
  const [curriculumsMostrados, setCurriculumsMostrados] = useState([]);

  useEffect(() => {
    const datos = curriculumsProp || JSON.parse(localStorage.getItem("curriculums")) || [];
    setCurriculumsMostrados(datos);
  }, [curriculumsProp]);

  // Función de filtrado
  const filtrarCurriculums = (termino, nivel) => {
    const datos = curriculumsProp || JSON.parse(localStorage.getItem("curriculums")) || [];
    
    if (!termino.trim() && !nivel) {
      return datos;
    }

    const terminoLower = termino.toLowerCase();
    
    return datos.filter((c) => {
      // Filtro por nombre o email
      const coincideBusqueda = 
        !termino.trim() || 
        c.nombre?.toLowerCase().includes(terminoLower) || 
        c.email?.toLowerCase().includes(terminoLower);
      
      // Filtro por nivel educativo
      const coincideNivel = 
        !nivel ||
        c.educacion?.some(edu => edu.nivelEducativo === nivel);
      
      return coincideBusqueda && coincideNivel;
    });
  };

  // Manejar cambio en el input de busqueda
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);
    setCurriculumsMostrados(filtrarCurriculums(valor, nivelEducativoFiltro));
  };

  // Manejar cambio en el filtro de nivel educativo
  const handleNivelEducativoChange = (e) => {
    const valor = e.target.value;
    setNivelEducativoFiltro(valor);
    setCurriculumsMostrados(filtrarCurriculums(terminoBusqueda, valor));
  };

  // Opciones para el select de nivel educativo
  const opcionesNivelEducativo = [
    { value: '', label: 'Todos los niveles' },
    { value: 'secundarioCompleto', label: 'Secundario completo' },
    { value: 'terciarioEnCurso', label: 'Terciario en curso' },
    { value: 'terciarioCompleto', label: 'Terciario completo' },
    { value: 'universitarioEnCurso', label: 'Universitario en curso' },
    { value: 'universitarioCompleto', label: 'Universitario completo' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de curriculums</h2>
      
      {/* Barra de búsqueda y filtro */}
      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={terminoBusqueda}
          onChange={handleBusquedaChange}
          className={styles.searchInput}
        />
        
        <select
          value={nivelEducativoFiltro}
          onChange={handleNivelEducativoChange}
          className={styles.selectInput}
        >
          {opcionesNivelEducativo.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de resultados */}
      {curriculumsMostrados.length === 0 ? (
        <p className={styles.noCurriculums}>
          {terminoBusqueda || nivelEducativoFiltro 
            ? 'No hay resultados para tu búsqueda' 
            : 'No hay curriculums registrados'}
        </p>
      ) : (
        <ul className={styles.list}>
          {curriculumsMostrados.map((curriculum) => (
            <li key={curriculum.id} className={styles.listItem}>
              <div>
                <strong>{curriculum.nombre}</strong> - {curriculum.email}
              </div>
              <div className={styles.listItemDetails}>
                Teléfono: {curriculum.telefono}
              </div>

              {/* Educación */}
              <ul className={styles.educationList}>
                {curriculum.educacion?.map((edu, index) => (
                  <li key={`${edu.id || index}`}>
                    {edu.titulo} - {edu.institucion} ({edu.anio})
                    {edu.nivelEducativo && (
                      <span className={styles.educationLevel}>
                        ({traducirNivelEducativo(edu.nivelEducativo)})
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Botones */}
              <div className={styles.listItemButtons}>
                <button
                  onClick={() => onVerDetalle(curriculum)}
                  className={`${styles.button} ${styles.viewButton}`}
                >
                  Ver detalle
                </button>
                <button
                  onClick={() => onEliminar(curriculum.id)}
                  className={`${styles.button} ${styles.deleteButton}`}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CurriculumList;