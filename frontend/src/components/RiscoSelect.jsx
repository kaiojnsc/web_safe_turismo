// Nível de risco: todos veem a etiqueta colorida;
// só quem tem permissão (administrador/profissional) vê o seletor para alterar.

export const NIVEIS_RISCO = [
  { valor: "baixo", rotulo: "Baixo" },
  { valor: "medio", rotulo: "Médio" },
  { valor: "alto", rotulo: "Alto" },
];

const rotuloDe = (valor) =>
  NIVEIS_RISCO.find((nivel) => nivel.valor === valor)?.rotulo || "Baixo";

function RiscoSelect({ id, valor, podeEditar, onChange, nome }) {
  const atual = valor || "baixo";

  if (!podeEditar) {
    return <span className={`risco-badge risco-${atual}`}>{rotuloDe(atual)}</span>;
  }

  return (
    <select
      className={`risco-select risco-${atual}`}
      value={atual}
      aria-label={`Nível de risco de ${nome}`}
      onChange={(event) => onChange && onChange(id, event.target.value)}
    >
      {NIVEIS_RISCO.map((nivel) => (
        <option key={nivel.valor} value={nivel.valor}>
          {nivel.rotulo}
        </option>
      ))}
    </select>
  );
}

export default RiscoSelect;
