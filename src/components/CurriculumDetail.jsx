import styles from './CurriculumDetail.module.css';

function CurriculumDetail({ curriculum, onClose, onEdit }) {
  
  const nivelesEducativos = {
    secundarioCompleto: "Secundario completo",
    terciarioEnCurso: "Terciario en curso",
    terciarioCompleto: "Terciario completo",
    universitarioEnCurso: "Universitario en curso",
    universitarioCompleto: "Universitario completo"
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onEdit} className={styles.editButton}>
           Editar
        </button>
        <button onClick={onClose} className={styles.closeButton}>
           Cerrar
        </button>
      </div>
      
      {/*Información principal con imagen*/}
      <div className={styles.main}>
        {curriculum.imagen && (
          <img
            src={curriculum.imagen}
            alt="Foto de perfil"
            className={styles.profileImage}
          />
        )}
        <div style={{ flex: 1 }}>
          <h2 className={styles.name}>{curriculum.nombre}</h2>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> {curriculum.email}</p>
            <p><strong>Teléfono:</strong> {curriculum.telefono}</p>
          </div>
        </div>
      </div>

      {/*Sección de educacion*/}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Educación</h3>
        <ul className={styles.list}>
          {curriculum.educacion.map((edu, index) => (
            <li key={index} className={styles.listItem}>
              <div><strong>{edu.titulo}</strong></div>
              <div>{edu.institucion}</div>
              <div className={styles.jobDates}>{edu.anio}</div>
              <div>{nivelesEducativos[edu.nivelEducativo] || edu.nivelEducativo}</div>
            </li>
          ))}
        </ul>
      </div>

      {/*Sección de experiencia laboral*/}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Experiencia Laboral</h3>

        {curriculum.experiencia && curriculum.experiencia.length > 0 ? (
          <ul className={styles.list}>
            {curriculum.experiencia.map((exp, index) => (
              <li key={index} className={styles.expItem}>
                <div className={styles.jobHeader}>
                  <h4 className={styles.jobTitle}>{exp.cargo}</h4>
                  <div className={styles.jobDates}>
                    {exp.fechaInicio} - {exp.fechaFin || 'Presente'}
                  </div>
                </div>
                <p className={styles.jobCompany}>{exp.empleador}</p>
                {exp.responsabilidades && (
                  <div className={styles.jobDesc}>
                    <strong>Responsabilidades:</strong>
                    <p>{exp.responsabilidades}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>
            No se registró experiencia laboral
          </p>
        )}
      </div>
    </div>
  );
}

export default CurriculumDetail;
