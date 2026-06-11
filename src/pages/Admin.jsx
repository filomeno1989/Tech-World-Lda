import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const SENHA = import.meta.env.VITE_ADMIN_PASSWORD
const CATEGORIAS = ['Telemóveis', 'Televisões', 'Tablets', 'Electrodomésticos', 'Computadores', 'Outros']

const s = {
  page: { minHeight: '100vh', background: '#f4f6f9' },
  header: { background: '#0055A5', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 18 },
  headerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, padding: '6px 16px', fontSize: 13, cursor: 'pointer' },
  loginBox: { maxWidth: 380, margin: '80px auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  loginTitle: { fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#1a202c' },
  loginSub: { fontSize: 14, color: '#718096', marginBottom: 24 },
  label: { fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#f4f6f9', marginBottom: 14, outline: 'none' },
  select: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#f4f6f9', marginBottom: 14, outline: 'none' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#f4f6f9', marginBottom: 14, outline: 'none', resize: 'vertical', minHeight: 80 },
  btnPrimary: { background: '#0055A5', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', width: '100%', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer' },
  btnDanger: { background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  btnSuccess: { background: '#f0fff4', color: '#276749', border: '1px solid #c6f6d5', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  btnWarning: { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '24px 20px' },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  tabBar: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: (active) => ({
    border: active ? 'none' : '1px solid #e2e8f0',
    background: active ? '#0055A5' : '#fff',
    color: active ? '#fff' : '#718096',
    borderRadius: 8,
    padding: '8px 20px',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #e2e8f0', color: '#718096', fontWeight: 500, fontSize: 12 },
  td: { padding: '12px', borderBottom: '1px solid #f4f6f9', verticalAlign: 'middle' },
  badge: (status) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 500,
    background: status === 'pendente' ? '#fffbeb' : status === 'confirmado' ? '#f0fff4' : '#f4f6f9',
    color: status === 'pendente' ? '#92400e' : status === 'confirmado' ? '#276749' : '#718096',
  }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  closeBtn: { background: '#f4f6f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#718096' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 },
  statCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', textAlign: 'center' },
  statNum: { fontSize: 28, fontWeight: 600, fontFamily: 'Sora, sans-serif', color: '#0055A5' },
  statLabel: { fontSize: 12, color: '#a0aec0', marginTop: 4 },
  erro: { background: '#fff5f5', color: '#c53030', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 },
  sucesso: { background: '#f0fff4', color: '#276749', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 },
  filterBar: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' },
  filterInput: { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, background: '#f4f6f9', outline: 'none', flex: 1, minWidth: 180 },
  filterBtn: (active) => ({
    border: active ? 'none' : '1px solid #e2e8f0',
    background: active ? '#0055A5' : '#fff',
    color: active ? '#fff' : '#718096',
    borderRadius: 8,
    padding: '7px 16px',
    fontSize: 13,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }),
}

const formVazio = { nome: '', marca: '', categoria: 'Telemóveis', preco: '', preco_original: '', descricao: '', foto_url: '', disponivel: true, tag: '', specs: '' }

export default function Admin() {
  const [logado, setLogado] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroLogin, setErroLogin] = useState('')
  const [tab, setTab] = useState('produtos')
  const [produtos, setProdutos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(formVazio)
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')

  // Filtros
  const [filtroPedido, setFiltroPedido] = useState('todos')
  const [filtroCliente, setFiltroCliente] = useState('')

  function login() {
    if (senha === SENHA) { setLogado(true); setErroLogin('') }
    else setErroLogin('Senha incorreta.')
  }

  useEffect(() => {
    if (logado) { carregarProdutos(); carregarPedidos(); carregarClientes() }
  }, [logado])

  async function carregarProdutos() {
    setLoading(true)
    const { data } = await supabase.from('produtos').select('*').order('criado_em', { ascending: false })
    setProdutos(data || [])
    setLoading(false)
  }

  async function carregarPedidos() {
    const { data } = await supabase
      .from('pedidos')
      .select(`*, produtos(nome, preco)`)
      .order('criado_em', { ascending: false })
    setPedidos(data || [])
  }

  async function carregarClientes() {
    const { data } = await supabase.from('clientes').select('*').order('criado_em', { ascending: false })
    setClientes(data || [])
  }

  function abrirModal(p = null) {
    setEditando(p)
    if (p) {
      setForm({ nome: p.nome || '', marca: p.marca || '', categoria: p.categoria || 'Telemóveis', preco: p.preco || '', preco_original: p.preco_original || '', descricao: p.descricao || '', foto_url: p.foto_url || '', disponivel: p.disponivel !== false, tag: p.tag || '', specs: p.specs ? JSON.stringify(p.specs, null, 2) : '' })
    } else {
      setForm(formVazio)
    }
    setMsg(''); setErro('')
    setModal(true)
  }

  async function salvarProduto() {
    if (!form.nome.trim() || !form.preco) { setErro('Nome e preço são obrigatórios.'); return }
    setErro('')
    let specsObj = null
    if (form.specs.trim()) {
      try { specsObj = JSON.parse(form.specs) } catch { setErro('Especificações com formato inválido. Use JSON válido.'); return }
    }
    const dados = { nome: form.nome, marca: form.marca, categoria: form.categoria, preco: parseFloat(form.preco), preco_original: form.preco_original ? parseFloat(form.preco_original) : null, descricao: form.descricao, foto_url: form.foto_url, disponivel: form.disponivel, tag: form.tag, specs: specsObj }
    if (editando) {
      const { error } = await supabase.from('produtos').update(dados).eq('id', editando.id)
      if (error) { setErro('Erro ao atualizar.'); return }
      setMsg('Produto atualizado com sucesso!')
    } else {
      const { error } = await supabase.from('produtos').insert([dados])
      if (error) { setErro('Erro ao adicionar.'); return }
      setMsg('Produto adicionado com sucesso!')
    }
    carregarProdutos()
    setTimeout(() => { setModal(false); setMsg('') }, 1500)
  }

  async function toggleDisponivel(p) {
    await supabase.from('produtos').update({ disponivel: !p.disponivel }).eq('id', p.id)
    carregarProdutos()
  }

  async function eliminarProduto(id) {
    if (!confirm('Tens a certeza que queres eliminar este produto?')) return
    await supabase.from('produtos').delete().eq('id', id)
    carregarProdutos()
  }

  async function atualizarStatusPedido(id, status) {
    await supabase.from('pedidos').update({ status }).eq('id', id)
    carregarPedidos()
  }

  async function eliminarPedido(id) {
    if (!confirm('Eliminar este pedido?')) return
    await supabase.from('pedidos').delete().eq('id', id)
    carregarPedidos()
  }

  // Apagar cliente SEM apagar pedidos
  async function eliminarCliente(id) {
    if (!confirm('Apagar este cliente? Os pedidos dele ficam guardados.')) return
    // Remove a ligação cliente_id nos pedidos deste cliente antes de apagar
    await supabase.from('pedidos').update({ cliente_id: null }).eq('cliente_id', id)
    await supabase.from('clientes').delete().eq('id', id)
    carregarClientes()
    carregarPedidos()
  }

  // Pedidos filtrados
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroPedido === 'todos') return true
    return p.status === filtroPedido
  })

  // Clientes filtrados
  const clientesFiltrados = clientes.filter(c => {
    if (!filtroCliente.trim()) return true
    const q = filtroCliente.toLowerCase()
    return (
      c.nome?.toLowerCase().includes(q) ||
      c.telefone?.includes(q) ||
      c.bairro?.toLowerCase().includes(q)
    )
  })

  if (!logado) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={s.loginBox}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
          <h2 style={s.loginTitle}>Painel Admin</h2>
          <p style={s.loginSub}>Tech World, Lda — Acesso restrito</p>
          <label style={s.label}>Senha de acesso</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {erroLogin && <div style={s.erro}>{erroLogin}</div>}
          <button style={s.btnPrimary} onClick={login}>Entrar</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.headerTitle}>⚙️ Painel Admin</div>
          <div style={s.headerSub}>Tech World, Lda</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/" target="_blank" style={{ ...s.logoutBtn, display: 'flex', alignItems: 'center' }}>Ver loja 🔗</a>
          <button style={s.logoutBtn} onClick={() => setLogado(false)}>Sair</button>
        </div>
      </header>

      <div style={s.container}>
        {/* Stats */}
        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statNum}>{produtos.length}</div><div style={s.statLabel}>Produtos</div></div>
          <div style={s.statCard}><div style={s.statNum}>{pedidos.length}</div><div style={s.statLabel}>Pedidos</div></div>
          <div style={s.statCard}><div style={{ ...s.statNum, color: '#E24B4A' }}>{pedidos.filter(p => p.status === 'pendente').length}</div><div style={s.statLabel}>Pendentes</div></div>
          <div style={s.statCard}><div style={{ ...s.statNum, color: '#38a169' }}>{clientes.length}</div><div style={s.statLabel}>Clientes</div></div>
        </div>

        {/* Tabs */}
        <div style={s.tabBar}>
          {['produtos', 'pedidos', 'clientes'].map(t => (
            <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
              {t === 'produtos' ? '📦 Produtos' : t === 'pedidos' ? '🛒 Pedidos' : '👥 Clientes'}
            </button>
          ))}
        </div>

        {/* Produtos */}
        {tab === 'produtos' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16 }}>Catálogo de Produtos</h3>
              <button style={{ ...s.btnPrimary, width: 'auto', padding: '9px 20px', fontSize: 13 }} onClick={() => abrirModal()}>+ Adicionar Produto</button>
            </div>
            {loading ? <p style={{ color: '#718096', textAlign: 'center', padding: 20 }}>A carregar...</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nome</th>
                      <th style={s.th}>Categoria</th>
                      <th style={s.th}>Preço (MZN)</th>
                      <th style={s.th}>Estado</th>
                      <th style={s.th}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map(p => (
                      <tr key={p.id}>
                        <td style={s.td}>
                          <div style={{ fontWeight: 500 }}>{p.nome}</div>
                          <div style={{ fontSize: 11, color: '#a0aec0' }}>{p.marca}</div>
                        </td>
                        <td style={s.td}>{p.categoria}</td>
                        <td style={s.td}>
                          {p.preco_original && <div style={{ fontSize: 11, color: '#a0aec0', textDecoration: 'line-through' }}>{Number(p.preco_original).toLocaleString('pt-MZ')}</div>}
                          {Number(p.preco).toLocaleString('pt-MZ')}
                        </td>
                        <td style={s.td}>
                          <span style={s.badge(p.disponivel ? 'confirmado' : 'cancelado')}>
                            {p.disponivel ? 'Disponível' : 'Esgotado'}
                          </span>
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button style={s.btnWarning} onClick={() => abrirModal(p)}>Editar</button>
                            <button style={p.disponivel ? s.btnDanger : s.btnSuccess} onClick={() => toggleDisponivel(p)}>
                              {p.disponivel ? 'Esgotar' : 'Repor'}
                            </button>
                            <button style={s.btnDanger} onClick={() => eliminarProduto(p.id)}>Apagar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {produtos.length === 0 && <p style={{ textAlign: 'center', padding: 30, color: '#a0aec0' }}>Nenhum produto. Adiciona o primeiro!</p>}
              </div>
            )}
          </div>
        )}

        {/* Pedidos */}
        {tab === 'pedidos' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16 }}>Pedidos Recebidos</h3>
              <span style={{ fontSize: 13, color: '#718096' }}>{pedidosFiltrados.length} pedido(s)</span>
            </div>

            {/* Filtro de pedidos */}
            <div style={s.filterBar}>
              {['todos', 'pendente', 'confirmado', 'cancelado'].map(f => (
                <button key={f} style={s.filterBtn(filtroPedido === f)} onClick={() => setFiltroPedido(f)}>
                  {f === 'todos' ? '📋 Todos' : f === 'pendente' ? '⏳ Pendentes' : f === 'confirmado' ? '✅ Confirmados' : '❌ Cancelados'}
                  {f !== 'todos' && (
                    <span style={{ marginLeft: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                      {pedidos.filter(p => p.status === f).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Data</th>
                    <th style={s.th}>Cliente</th>
                    <th style={s.th}>Telemóvel</th>
                    <th style={s.th}>Produto</th>
                    <th style={s.th}>Bairro</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map(p => (
                    <tr key={p.id}>
                      <td style={s.td}>{new Date(p.criado_em).toLocaleDateString('pt-MZ')}</td>
                      <td style={s.td}><div style={{ fontWeight: 500 }}>{p.cliente_nome || '—'}</div></td>
                      <td style={s.td}>{p.cliente_telefone || '—'}</td>
                      <td style={s.td}>{p.produtos?.nome}</td>
                      <td style={s.td}>{p.cliente_bairro || '—'}</td>
                      <td style={s.td}><span style={s.badge(p.status)}>{p.status}</span></td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {p.status === 'pendente' && <button style={s.btnSuccess} onClick={() => atualizarStatusPedido(p.id, 'confirmado')}>Confirmar</button>}
                          {p.status !== 'cancelado' && <button style={s.btnDanger} onClick={() => atualizarStatusPedido(p.id, 'cancelado')}>Cancelar</button>}
                          <button style={s.btnDanger} onClick={() => eliminarPedido(p.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pedidosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', padding: 30, color: '#a0aec0' }}>
                  {filtroPedido === 'todos' ? 'Nenhum pedido ainda.' : `Nenhum pedido ${filtroPedido}.`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Clientes */}
        {tab === 'clientes' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16 }}>Clientes Registados</h3>
              <span style={{ fontSize: 13, color: '#718096' }}>{clientesFiltrados.length} cliente(s)</span>
            </div>

            {/* Filtro de clientes */}
            <div style={s.filterBar}>
              <input
                style={s.filterInput}
                placeholder="🔍  Pesquisar por nome, telefone ou bairro..."
                value={filtroCliente}
                onChange={e => setFiltroCliente(e.target.value)}
              />
              {filtroCliente && (
                <button style={s.btnDanger} onClick={() => setFiltroCliente('')}>Limpar</button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Nome</th>
                    <th style={s.th}>Telemóvel</th>
                    <th style={s.th}>WhatsApp</th>
                    <th style={s.th}>Bairro</th>
                    <th style={s.th}>Registado em</th>
                    <th style={s.th}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map(c => (
                    <tr key={c.id}>
                      <td style={s.td}><div style={{ fontWeight: 500 }}>{c.nome}</div></td>
                      <td style={s.td}>{c.telefone}</td>
                      <td style={s.td}>{c.whatsapp || '—'}</td>
                      <td style={s.td}>{c.bairro || '—'}</td>
                      <td style={s.td}>{new Date(c.criado_em).toLocaleDateString('pt-MZ')}</td>
                      <td style={s.td}>
                        <button style={s.btnDanger} onClick={() => eliminarCliente(c.id)}>🗑️ Apagar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clientesFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', padding: 30, color: '#a0aec0' }}>
                  {filtroCliente ? 'Nenhum cliente encontrado.' : 'Nenhum cliente ainda.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Produto */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16 }}>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button style={s.closeBtn} onClick={() => setModal(false)}>✕</button>
            </div>
            {msg && <div style={s.sucesso}>{msg}</div>}
            {erro && <div style={s.erro}>{erro}</div>}
            <label style={s.label}>Nome do produto *</label>
            <input style={s.input} placeholder="Ex: Tecno Spark 30C" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            <label style={s.label}>Marca</label>
            <input style={s.input} placeholder="Ex: Tecno, Samsung, LG..." value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />
            <label style={s.label}>Categoria</label>
            <select style={s.select} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label style={s.label}>Preço actual (MZN) *</label>
            <input style={s.input} type="number" placeholder="Ex: 12500" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
            <label style={s.label}>Preço original (MZN) — só para promoções</label>
            <input style={s.input} type="number" placeholder="Ex: 15000 (será riscado no catálogo)" value={form.preco_original} onChange={e => setForm({ ...form, preco_original: e.target.value })} />
            <label style={s.label}>Descrição</label>
            <textarea style={s.textarea} placeholder="Descrição do produto..." value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
            <label style={s.label}>URL da foto (link direto da imagem)</label>
            <input style={s.input} placeholder="https://..." value={form.foto_url} onChange={e => setForm({ ...form, foto_url: e.target.value })} />
            <label style={s.label}>Tag</label>
            <select style={s.select} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>
              <option value="">Sem tag</option>
              <option value="new">Novo</option>
              <option value="sale">Promoção</option>
            </select>
            <label style={s.label}>Especificações (formato JSON)</label>
            <textarea style={{ ...s.textarea, fontFamily: 'monospace', fontSize: 12 }} placeholder={'{\n  "RAM": "8GB",\n  "Ecrã": "6.5 polegadas"\n}'} value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input type="checkbox" id="disp" checked={form.disponivel} onChange={e => setForm({ ...form, disponivel: e.target.checked })} />
              <label htmlFor="disp" style={{ fontSize: 14, cursor: 'pointer' }}>Produto disponível em stock</label>
            </div>
            <button style={s.btnPrimary} onClick={salvarProduto}>{editando ? 'Guardar Alterações' : 'Adicionar Produto'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
