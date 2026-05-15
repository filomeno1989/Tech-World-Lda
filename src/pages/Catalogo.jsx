import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const CATEGORIAS = ['Todos', 'Telemóveis', 'Televisões', 'Tablets', 'Electrodomésticos', 'Computadores', 'Outros']
const WA = import.meta.env.VITE_WHATSAPP_NUMBER

const styles = {
  header: {
    background: 'linear-gradient(135deg, #0055A5 0%, #003d7a 100%)',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,85,165,0.3)',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { color: '#fff', fontSize: 20, fontFamily: 'Sora, sans-serif', fontWeight: 600 },
  logoSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 },
  cartBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: 8,
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
  },
  badge: {
    background: '#E24B4A',
    color: '#fff',
    borderRadius: '50%',
    width: 20,
    height: 20,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
  },
  searchBar: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 20px',
  },
  searchInput: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    background: '#f4f6f9',
  },
  catsBar: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '10px 20px',
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    maxWidth: '100%',
  },
  catBtn: (active) => ({
    border: active ? 'none' : '1px solid #e2e8f0',
    background: active ? '#0055A5' : '#fff',
    color: active ? '#fff' : '#718096',
    borderRadius: 20,
    padding: '6px 18px',
    fontSize: 13,
    whiteSpace: 'nowrap',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.15s',
  }),
  grid: {
    maxWidth: 1200,
    margin: '24px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardImg: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    background: '#f4f6f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  cardBody: { padding: '12px' },
  cardBrand: { fontSize: 11, color: '#a0aec0', marginBottom: 4 },
  cardName: { fontSize: 14, fontWeight: 500, color: '#1a202c', marginBottom: 6, lineHeight: 1.3 },
  cardPrice: { fontSize: 16, fontWeight: 600, color: '#0055A5' },
  tag: (type) => ({
    display: 'inline-block',
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 10,
    marginTop: 6,
    background: type === 'new' ? '#e6f1fb' : '#fff5f5',
    color: type === 'new' ? '#185FA5' : '#c53030',
    fontWeight: 500,
  }),
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sheet: {
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: 24,
  },
  sheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    background: '#f4f6f9',
    border: 'none',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#718096',
  },
  btnPrimary: {
    background: '#0055A5',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '13px 20px',
    width: '100%',
    fontSize: 15,
    fontFamily: 'Sora, sans-serif',
    fontWeight: 600,
    marginTop: 16,
  },
  btnSecondary: {
    background: '#f4f6f9',
    color: '#1a202c',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '12px 20px',
    width: '100%',
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    marginTop: 8,
  },
  formGroup: { marginBottom: 14 },
  formLabel: { fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 },
  formInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    background: '#f4f6f9',
    outline: 'none',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f4f6f9',
    fontSize: 13,
  },
  successBox: {
    background: '#f0fff4',
    border: '1px solid #c6f6d5',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#a0aec0',
  },
  loading: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#718096',
  },
  indisponivel: {
    background: '#fff5f5',
    color: '#c53030',
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 10,
    display: 'inline-block',
    marginTop: 6,
  },
}

const ICONES = {
  'Telemóveis': '📱',
  'Televisões': '📺',
  'Tablets': '⬛',
  'Electrodomésticos': '🏠',
  'Computadores': '💻',
  'Outros': '📦',
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [catAtiva, setCatAtiva] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [verPedido, setVerPedido] = useState(false)
  const [carrinho, setCarrinho] = useState([])
  const [verCarrinho, setVerCarrinho] = useState(false)
  const [form, setForm] = useState({ nome: '', telefone: '', whatsapp: '', bairro: '', observacoes: '' })
  const [enviando, setEnviando] = useState(false)
  const [pedidoOk, setPedidoOk] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false })
    if (!error) setProdutos(data || [])
    setLoading(false)
  }

  const produtosFiltrados = produtos.filter(p => {
    const matchCat = catAtiva === 'Todos' || p.categoria === catAtiva
    const matchBusca = !busca || p.nome?.toLowerCase().includes(busca.toLowerCase()) || p.marca?.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  function abrirDetalhe(p) {
    setProdutoSelecionado(p)
    setVerPedido(false)
    setPedidoOk(false)
    setErro('')
  }

  function addCarrinho(p) {
    if (!carrinho.find(x => x.id === p.id)) {
      setCarrinho([...carrinho, p])
    }
  }

  function removerCarrinho(id) {
    setCarrinho(carrinho.filter(x => x.id !== id))
  }

  async function enviarPedido() {
    if (!form.nome.trim() || !form.telefone.trim()) {
      setErro('Por favor preenche o nome e o número de telemóvel.')
      return
    }
    setEnviando(true)
    setErro('')

    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .insert([{ nome: form.nome, telefone: form.telefone, whatsapp: form.whatsapp || form.telefone, bairro: form.bairro }])
      .select()
      .single()

    if (clienteError) { setErro('Erro ao registar cliente. Tenta novamente.'); setEnviando(false); return }

    const produtosParaPedido = produtoSelecionado ? [produtoSelecionado] : carrinho
    for (const p of produtosParaPedido) {
      await supabase.from('pedidos').insert([{ cliente_id: clienteData.id, produto_id: p.id, observacoes: form.observacoes, status: 'pendente' }])
    }

    const prodNomes = produtosParaPedido.map(p => {
      const precoFmt = Number(p.preco).toLocaleString('pt-MZ') + ' MZN'
      const precoOrigFmt = p.preco_original ? Number(p.preco_original).toLocaleString('pt-MZ') + ' MZN' : null
      return precoOrigFmt ? `${p.nome} (${precoFmt}, era ${precoOrigFmt})` : `${p.nome} (${precoFmt})`
    }).join('%0A   - ')
    const msg = encodeURIComponent(`🛒 *Novo Pedido — Tech World, Lda*\n\n👤 *Cliente:* ${form.nome}\n📞 *Tel:* ${form.telefone}\n📍 *Bairro:* ${form.bairro || 'Não informado'}\n\n🛍️ *Produto(s):*\n   - `) + prodNomes + encodeURIComponent(`\n\n📝 *Obs:* ${form.observacoes || 'Nenhuma'}\n\n_Pedido enviado via catálogo digital._`)
    window.open(`https://wa.me/${WA}?text=${msg}`, '_blank')

    setPedidoOk(true)
    setCarrinho([])
    setEnviando(false)
  }

  const totalCarrinho = carrinho.reduce((s, p) => s + (p.preco || 0), 0)

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.logo}>Tech World, Lda</div>
            <div style={styles.logoSub}>Catálogo Digital — Beira</div>
          </div>
          <button style={styles.cartBtn} onClick={() => setVerCarrinho(true)}>
            🛒 Carrinho
            <span style={styles.badge}>{carrinho.length}</span>
          </button>
        </div>
      </header>

      {/* Search */}
      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Pesquisar produto, marca..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div style={styles.catsBar}>
        {CATEGORIAS.map(c => (
          <button key={c} style={styles.catBtn(catAtiva === c)} onClick={() => setCatAtiva(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {loading && <div style={styles.loading}>A carregar produtos...</div>}
        {!loading && produtosFiltrados.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 40 }}>📦</div>
            <p style={{ marginTop: 12, fontSize: 15 }}>Nenhum produto encontrado</p>
          </div>
        )}
        {produtosFiltrados.map(p => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => abrirDetalhe(p)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <div style={styles.cardImg}>
              {p.foto_url
                ? <img src={p.foto_url} alt={p.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span>{ICONES[p.categoria] || '📦'}</span>
              }
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardBrand}>{p.marca} · {p.categoria}</div>
              <div style={styles.cardName}>{p.nome}</div>
              {p.tag === 'sale' && p.preco_original && (
                <div style={{ fontSize: 12, color: '#a0aec0', textDecoration: 'line-through', marginBottom: 2 }}>
                  {Number(p.preco_original).toLocaleString('pt-MZ')} MZN
                </div>
              )}
              <div style={styles.cardPrice}>{Number(p.preco).toLocaleString('pt-MZ')} <span style={{ fontSize: 12, fontWeight: 400, color: '#a0aec0' }}>MZN</span></div>
              {p.tag && <span style={styles.tag(p.tag)}>{p.tag === 'new' ? 'Novo' : 'Promoção'}</span>}
              {!p.disponivel && <span style={styles.indisponivel}>Esgotado</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Detalhe do produto */}
      {produtoSelecionado && (
        <div style={styles.overlay} onClick={() => { setProdutoSelecionado(null); setVerPedido(false); setPedidoOk(false) }}>
          <div style={styles.sheet} onClick={e => e.stopPropagation()}>
            {!verPedido && !pedidoOk && (
              <>
                <div style={styles.sheetHeader}>
                  <span style={{ fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>{produtoSelecionado.nome}</span>
                  <button style={styles.closeBtn} onClick={() => { setProdutoSelecionado(null); setVerPedido(false) }}>✕</button>
                </div>
                <div style={{ width: '100%', height: 200, background: '#f4f6f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: 16 }}>
                  {produtoSelecionado.foto_url
                    ? <img src={produtoSelecionado.foto_url} alt={produtoSelecionado.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                    : ICONES[produtoSelecionado.categoria] || '📦'
                  }
                </div>
                <div style={{ fontSize: 13, color: '#a0aec0', marginBottom: 4 }}>{produtoSelecionado.marca} · {produtoSelecionado.categoria}</div>
                {produtoSelecionado.tag === 'sale' && produtoSelecionado.preco_original && (
                  <div style={{ fontSize: 15, color: '#a0aec0', textDecoration: 'line-through', marginBottom: 2 }}>
                    {Number(produtoSelecionado.preco_original).toLocaleString('pt-MZ')} MZN
                  </div>
                )}
                <div style={{ fontSize: 24, fontWeight: 600, color: '#0055A5', marginBottom: 8 }}>
                  {Number(produtoSelecionado.preco).toLocaleString('pt-MZ')} <span style={{ fontSize: 14, fontWeight: 400, color: '#a0aec0' }}>MZN</span>
                  {produtoSelecionado.tag === 'sale' && produtoSelecionado.preco_original && (
                    <span style={{ marginLeft: 8, fontSize: 12, background: '#fff5f5', color: '#c53030', borderRadius: 8, padding: '2px 8px', fontWeight: 500 }}>
                      -{Math.round((1 - produtoSelecionado.preco / produtoSelecionado.preco_original) * 100)}% OFF
                    </span>
                  )}
                </div>
                {produtoSelecionado.descricao && <p style={{ fontSize: 14, color: '#718096', marginBottom: 12, lineHeight: 1.6 }}>{produtoSelecionado.descricao}</p>}
                {produtoSelecionado.specs && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#718096', marginBottom: 6 }}>Especificações</div>
                    {Object.entries(produtoSelecionado.specs).map(([k, v]) => (
                      <div key={k} style={styles.specRow}>
                        <span style={{ color: '#a0aec0' }}>{k}</span>
                        <span style={{ fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!produtoSelecionado.disponivel && <div style={{ ...styles.indisponivel, display: 'block', textAlign: 'center', marginBottom: 8, padding: '8px' }}>Este produto está esgotado</div>}
                {produtoSelecionado.disponivel && (
                  <>
                    <button style={styles.btnPrimary} onClick={() => setVerPedido(true)}>🛒 Fazer Pedido</button>
                    <button style={styles.btnSecondary} onClick={() => { addCarrinho(produtoSelecionado); setProdutoSelecionado(null) }}>+ Adicionar ao carrinho</button>
                  </>
                )}
              </>
            )}

            {verPedido && !pedidoOk && (
              <>
                <div style={styles.sheetHeader}>
                  <span style={{ fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>Dados para o Pedido</span>
                  <button style={styles.closeBtn} onClick={() => setVerPedido(false)}>✕</button>
                </div>
                <div style={{ background: '#f4f6f9', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                  <span style={{ color: '#718096' }}>Produto: </span>
                  <strong>{produtoSelecionado.nome}</strong> — {Number(produtoSelecionado.preco).toLocaleString('pt-MZ')} MZN
                </div>
                {erro && <div style={{ background: '#fff5f5', color: '#c53030', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>{erro}</div>}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome completo *</label>
                  <input style={styles.formInput} placeholder="Ex: João Manuel Silva" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Número de telemóvel *</label>
                  <input style={styles.formInput} placeholder="Ex: 84 000 0000" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>WhatsApp (se diferente)</label>
                  <input style={styles.formInput} placeholder="Opcional" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Bairro / Localização</label>
                  <input style={styles.formInput} placeholder="Ex: Macuti, Chingussura, Ponta-Gêa..." value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Observações</label>
                  <input style={styles.formInput} placeholder="Cor preferida, dúvida, etc." value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} />
                </div>
                <button style={{ ...styles.btnPrimary, opacity: enviando ? 0.7 : 1 }} onClick={enviarPedido} disabled={enviando}>
                  {enviando ? 'A enviar...' : '📲 Confirmar Pedido via WhatsApp'}
                </button>
                <button style={styles.btnSecondary} onClick={() => setVerPedido(false)}>Voltar</button>
              </>
            )}

            {pedidoOk && (
              <>
                <div style={styles.sheetHeader}>
                  <span style={{ fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>Pedido Enviado</span>
                  <button style={styles.closeBtn} onClick={() => { setProdutoSelecionado(null); setVerPedido(false); setPedidoOk(false) }}>✕</button>
                </div>
                <div style={styles.successBox}>
                  <div style={{ fontSize: 48 }}>✅</div>
                  <h3 style={{ color: '#276749', marginTop: 8, fontFamily: 'Sora, sans-serif' }}>Pedido recebido!</h3>
                  <p style={{ fontSize: 14, color: '#38a169', marginTop: 8, lineHeight: 1.6 }}>
                    A nossa equipa vai contactar <strong>{form.nome}</strong> via chamada ou WhatsApp no número <strong>{form.telefone}</strong> para confirmar a disponibilidade e o delivery.
                  </p>
                  <p style={{ fontSize: 12, color: '#a0aec0', marginTop: 12 }}>Tempo de resposta: até 24 horas úteis</p>
                </div>
                <button style={styles.btnSecondary} onClick={() => { setProdutoSelecionado(null); setVerPedido(false); setPedidoOk(false); setForm({ nome: '', telefone: '', whatsapp: '', bairro: '', observacoes: '' }) }}>
                  Continuar a ver produtos
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Carrinho */}
      {verCarrinho && (
        <div style={styles.overlay} onClick={() => setVerCarrinho(false)}>
          <div style={styles.sheet} onClick={e => e.stopPropagation()}>
            {!pedidoOk ? (
              <>
                <div style={styles.sheetHeader}>
                  <span style={{ fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>Carrinho ({carrinho.length})</span>
                  <button style={styles.closeBtn} onClick={() => setVerCarrinho(false)}>✕</button>
                </div>
                {carrinho.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#a0aec0' }}>
                    <div style={{ fontSize: 40 }}>🛒</div>
                    <p style={{ marginTop: 12 }}>Carrinho vazio</p>
                  </div>
                ) : (
                  <>
                    {carrinho.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f4f6f9' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nome}</div>
                          <div style={{ fontSize: 13, color: '#718096' }}>{Number(p.preco).toLocaleString('pt-MZ')} MZN</div>
                        </div>
                        <button onClick={() => removerCarrinho(p.id)} style={{ background: '#fff5f5', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#c53030', fontSize: 12 }}>Remover</button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontWeight: 600, fontSize: 15 }}>
                      <span>Total</span>
                      <span style={{ color: '#0055A5' }}>{totalCarrinho.toLocaleString('pt-MZ')} MZN</span>
                    </div>
                    {erro && <div style={{ background: '#fff5f5', color: '#c53030', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>{erro}</div>}
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nome completo *</label>
                      <input style={styles.formInput} placeholder="Ex: João Manuel Silva" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Número de telemóvel *</label>
                      <input style={styles.formInput} placeholder="Ex: 84 000 0000" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Bairro / Localização</label>
                      <input style={styles.formInput} placeholder="Ex: Macuti, Chingussura..." value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Observações</label>
                      <input style={styles.formInput} placeholder="Notas adicionais..." value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} />
                    </div>
                    <button style={{ ...styles.btnPrimary, opacity: enviando ? 0.7 : 1 }} onClick={enviarPedido} disabled={enviando}>
                      {enviando ? 'A enviar...' : '📲 Confirmar Pedido via WhatsApp'}
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={styles.sheetHeader}>
                  <span style={{ fontSize: 16, fontFamily: 'Sora, sans-serif', fontWeight: 600 }}>Pedido Enviado</span>
                  <button style={styles.closeBtn} onClick={() => { setVerCarrinho(false); setPedidoOk(false) }}>✕</button>
                </div>
                <div style={styles.successBox}>
                  <div style={{ fontSize: 48 }}>✅</div>
                  <h3 style={{ color: '#276749', marginTop: 8, fontFamily: 'Sora, sans-serif' }}>Pedido recebido!</h3>
                  <p style={{ fontSize: 14, color: '#38a169', marginTop: 8, lineHeight: 1.6 }}>
                    A nossa equipa vai contactar <strong>{form.nome}</strong> para confirmar e agendar o delivery.
                  </p>
                </div>
                <button style={styles.btnSecondary} onClick={() => { setVerCarrinho(false); setPedidoOk(false); setForm({ nome: '', telefone: '', whatsapp: '', bairro: '', observacoes: '' }) }}>
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '30px 20px', color: '#a0aec0', fontSize: 13, borderTop: '1px solid #e2e8f0', marginTop: 40, background: '#fff' }}>
        <p>Tech World, Lda — Porto de Beira, Moçambique</p>
        <p style={{ marginTop: 4 }}>Para suporte: <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" style={{ color: '#0055A5' }}>WhatsApp</a></p>
      </footer>
    </div>
  )
}
