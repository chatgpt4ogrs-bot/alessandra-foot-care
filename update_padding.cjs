const fs = require("fs");
const files = [
  "src/routes/pacientes.tsx",
  "src/routes/paciente_.$id.editar.tsx",
  "src/routes/paciente.$id.tsx",
  "src/routes/novo.tsx",
  "src/routes/index.tsx",
  "src/routes/estoque.tsx",
  "src/routes/agenda.tsx",
];
files.forEach((f) => {
  let c = fs.readFileSync(f, "utf-8");
  c = c.replace(/px-8 py-8/g, "p-4 md:p-8").replace(/px-8 py-10/g, "p-4 py-8 md:p-8");
  fs.writeFileSync(f, c);
});
console.log("Done");
