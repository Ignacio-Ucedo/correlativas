export const patrones = {
  // Extrae en grupo 1 el nombre de la carrera
  carrera: /.+:[ \t]*\(\d+\)[ \t]*(.+?)\t/,

  // Extrae en grupo 1 el plan de estudios del historial académico (año)
  //plan: /.+:[ \t]*\(\d+-\d+\)[ \t]*(\d+)/,
  plan: /Plan:\s*(?:\([^)]*\)\s*)?(.*?)\s*V/, //Regex para ambos planes (En testing)

  // Extrae la línea que tiene los campos (nombres de columnas)
  campos: /\n[^\d\.,:\n]*\t[^\n]*\n/,

  // Extrae el bloque de materias. En grupo 1 el nombre de la materia, en grupo 2 el código
  materias: /([^\d:\n\ ][^\d:\n]+?)\((\d+)\).*\n*/g
};
