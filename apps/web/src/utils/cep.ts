export interface CepResult {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  error: boolean;
}

export async function lookupCep(cep: string): Promise<CepResult> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) throw new Error("CEP inválido");

  const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  const data = await res.json();

  if (data.erro) throw new Error("CEP não encontrado");

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
    error: false,
  };
}
