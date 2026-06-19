import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BsFlower1, BsGrid, BsPeople, BsGear, BsEnvelope, BsImage, BsBox, BsPlus, BsPencil, BsTrash, BsArrowLeft, BsCheck, BsX, BsEye, BsEyeSlash } from 'react-icons/bs'
import { supabaseAdmin as supabase, type Product, type TeamMember, type SiteSetting, type Message, type Banner } from '../lib/supabase'

const sidebarLinks = [
  { name: 'Dashboard', icon: BsGrid, path: '/admin' },
  { name: 'Products', icon: BsBox, path: '/admin/products' },
  { name: 'Team', icon: BsPeople, path: '/admin/team' },
  { name: 'Banners', icon: BsImage, path: '/admin/banners' },
  { name: 'Messages', icon: BsEnvelope, path: '/admin/messages' },
  { name: 'Settings', icon: BsGear, path: '/admin/settings' },
]

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simple password check - in production, use proper auth
    if (password === import.meta.env.VITE_ADMIN_PASSWORD || password === 'pharmanest2024') {
      localStorage.setItem('pharmanest_admin', 'true')
      onLogin()
      toast.success('Welcome to Admin Panel!')
    } else {
      toast.error('Invalid password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <BsFlower1 className="text-white text-2xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-500 mt-1">PharmaNest Management</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter admin password"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-xs text-gray-400 text-center">Default: pharmanest2024</p>
        </form>
      </div>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, team: 0, messages: 0, unread: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const [products, team, messages, unread] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('team').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ])
    setStats({
      products: products.count || 0,
      team: team.count || 0,
      messages: messages.count || 0,
      unread: unread.count || 0,
    })
  }

  const cards = [
    { title: 'Products', value: stats.products, icon: BsBox, color: 'from-emerald-500 to-teal-500', link: '/admin/products' },
    { title: 'Team Members', value: stats.team, icon: BsPeople, color: 'from-blue-500 to-indigo-500', link: '/admin/team' },
    { title: 'Messages', value: stats.messages, icon: BsEnvelope, color: 'from-purple-500 to-pink-500', link: '/admin/messages' },
    { title: 'Unread', value: stats.unread, icon: BsEnvelope, color: 'from-orange-500 to-red-500', link: '/admin/messages' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="group">
            <div className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
              <card.icon className="text-3xl mb-3 opacity-80" />
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm opacity-80">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  async function handleSave(product: Partial<Product>) {
    if (editingProduct?.id) {
      const { error } = await supabase.from('products').update(product).eq('id', editingProduct.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Product updated!')
    } else {
      const { error } = await supabase.from('products').insert([product])
      if (error) { toast.error('Failed to create'); return }
      toast.success('Product created!')
    }
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted!')
    fetchProducts()
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    fetchProducts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
        <button onClick={() => { setEditingProduct(null); setShowForm(true) }} className="btn-primary inline-flex items-center gap-2">
          <BsPlus /> Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingProduct(null) }} />
      )}

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Active</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{product.category}</td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">NPR {product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(product.id, product.is_active)} className={`p-1 rounded ${product.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                        {product.is_active ? <BsEye /> : <BsEyeSlash />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditingProduct(product); setShowForm(true) }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-blue-600"><BsPencil /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-red-600"><BsTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && <p className="text-center py-10 text-gray-500">No products yet.</p>}
        </div>
      )}
    </div>
  )
}

function ProductForm({ product, onSave, onCancel }: { product: Product | null; onSave: (p: Partial<Product>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || 'skincare',
    image_url: product?.image_url || '',
    stock: product?.stock || 0,
    is_active: product?.is_active ?? true,
  })

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{product ? 'Edit Product' : 'Add Product'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
          <option value="Cleanser">Cleanser</option>
          <option value="Moisturizer">Moisturizer</option>
          <option value="Serum">Serum</option>
          <option value="Sunscreen">Sunscreen</option>
          <option value="Toner">Toner</option>
          <option value="Mask">Mask</option>
          <option value="Treatment">Treatment</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" placeholder="Price (NPR)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input-field" />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field md:col-span-2" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-2" rows={3} />
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="btn-primary inline-flex items-center gap-2"><BsCheck /> Save</button>
        <button onClick={onCancel} className="btn-secondary inline-flex items-center gap-2"><BsX /> Cancel</button>
      </div>
    </div>
  )
}

function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    const { data } = await supabase.from('team').select('*').order('display_order')
    setMembers(data || [])
    setLoading(false)
  }

  async function handleSave(member: Partial<TeamMember>) {
    if (editingMember?.id) {
      await supabase.from('team').update(member).eq('id', editingMember.id)
      toast.success('Member updated!')
    } else {
      await supabase.from('team').insert([member])
      toast.success('Member added!')
    }
    setShowForm(false)
    setEditingMember(null)
    fetchMembers()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this member?')) return
    await supabase.from('team').delete().eq('id', id)
    toast.success('Member deleted!')
    fetchMembers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h2>
        <button onClick={() => { setEditingMember(null); setShowForm(true) }} className="btn-primary inline-flex items-center gap-2"><BsPlus /> Add Member</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
          <TeamForm member={editingMember} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingMember(null) }} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <div key={member.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-emerald-600 text-sm">{member.role}</p>
                  {member.bio && <p className="text-gray-500 text-sm mt-2">{member.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingMember(member); setShowForm(true) }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-blue-600"><BsPencil /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-red-600"><BsTrash /></button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && <p className="text-center py-10 text-gray-500 col-span-2">No team members yet.</p>}
        </div>
      )}
    </div>
  )
}

function TeamForm({ member, onSave, onCancel }: { member: TeamMember | null; onSave: (m: Partial<TeamMember>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
    email: member?.email || '',
    phone: member?.phone || '',
    display_order: member?.display_order || 0,
    is_active: member?.is_active ?? true,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
      <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
      <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
      <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field md:col-span-2" />
      <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field md:col-span-2" rows={3} />
      <input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
      <div className="flex gap-3 items-center">
        <button onClick={() => onSave(form)} className="btn-primary inline-flex items-center gap-2"><BsCheck /> Save</button>
        <button onClick={onCancel} className="btn-secondary inline-flex items-center gap-2"><BsX /> Cancel</button>
      </div>
    </div>
  )
}

function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  useEffect(() => { fetchBanners() }, [])

  async function fetchBanners() {
    const { data } = await supabase.from('banners').select('*').order('display_order')
    setBanners(data || [])
    setLoading(false)
  }

  async function handleSave(banner: Partial<Banner>) {
    if (editingBanner?.id) {
      await supabase.from('banners').update(banner).eq('id', editingBanner.id)
      toast.success('Banner updated!')
    } else {
      await supabase.from('banners').insert([banner])
      toast.success('Banner added!')
    }
    setShowForm(false)
    setEditingBanner(null)
    fetchBanners()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return
    await supabase.from('banners').delete().eq('id', id)
    toast.success('Banner deleted!')
    fetchBanners()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Banners</h2>
        <button onClick={() => { setEditingBanner(null); setShowForm(true) }} className="btn-primary inline-flex items-center gap-2"><BsPlus /> Add Banner</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <BannerForm banner={editingBanner} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingBanner(null) }} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{banner.title}</h3>
                  {banner.subtitle && <p className="text-gray-500 text-sm">{banner.subtitle}</p>}
                  <p className="text-xs text-gray-400 mt-1">Order: {banner.display_order} | Active: {banner.is_active ? 'Yes' : 'No'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingBanner(banner); setShowForm(true) }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-blue-600"><BsPencil /></button>
                  <button onClick={() => handleDelete(banner.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-red-600"><BsTrash /></button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-center py-10 text-gray-500">No banners yet.</p>}
        </div>
      )}
    </div>
  )
}

function BannerForm({ banner, onSave, onCancel }: { banner: Banner | null; onSave: (b: Partial<Banner>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image_url: banner?.image_url || '',
    button_text: banner?.button_text || '',
    button_link: banner?.button_link || '',
    display_order: banner?.display_order || 0,
    is_active: banner?.is_active ?? true,
  })

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{banner ? 'Edit Banner' : 'Add Banner'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
        <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-field" />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
        <input placeholder="Button Text" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} className="input-field" />
        <input placeholder="Button Link (e.g. /products)" value={form.button_link} onChange={(e) => setForm({ ...form, button_link: e.target.value })} className="input-field" />
        <input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="input-field" />
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="btn-primary inline-flex items-center gap-2"><BsCheck /> Save</button>
        <button onClick={onCancel} className="btn-secondary inline-flex items-center gap-2"><BsX /> Cancel</button>
      </div>
    </div>
  )
}

function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function markRead(id: string) {
    await supabase.from('messages').update({ is_read: true }).eq('id', id)
    fetchMessages()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    toast.success('Message deleted!')
    setSelectedMessage(null)
    fetchMessages()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h2>

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : selectedMessage ? (
        <div className="card p-6">
          <button onClick={() => setSelectedMessage(null)} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"><BsArrowLeft /> Back to messages</button>
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.subject || 'No Subject'}</h3>
            <p className="text-sm text-gray-500">From: {selectedMessage.name} ({selectedMessage.email})</p>
            <p className="text-xs text-gray-400">{new Date(selectedMessage.created_at).toLocaleString()}</p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
          <div className="flex gap-3 mt-6">
            <a href={`mailto:${selectedMessage.email}`} className="btn-primary text-sm">Reply via Email</a>
            <button onClick={() => handleDelete(selectedMessage.id)} className="btn-secondary text-sm text-red-600">Delete</button>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">From</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer ${!msg.is_read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`} onClick={() => { setSelectedMessage(msg); markRead(msg.id) }}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{msg.name}</p>
                      <p className="text-xs text-gray-500">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{msg.subject || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${msg.is_read ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>{msg.is_read ? 'Read' : 'New'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-red-600"><BsTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {messages.length === 0 && <p className="text-center py-10 text-gray-500">No messages yet.</p>}
        </div>
      )}
    </div>
  )
}

function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*').order('setting_key')
    setSettings(data || [])
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    for (const setting of settings) {
      await supabase.from('site_settings').update({ setting_value: setting.setting_value }).eq('id', setting.id)
    }
    toast.success('Settings saved!')
    setSaving(false)
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.setting_key === key ? { ...s, setting_value: value } : s)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
          <BsCheck /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : (
        <div className="card p-6 space-y-4">
          {settings.map((setting) => (
            <div key={setting.id}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                {setting.setting_key.replace(/_/g, ' ')}
              </label>
              {setting.setting_value && setting.setting_value.length > 100 ? (
                <textarea
                  value={setting.setting_value}
                  onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                  className="input-field"
                  rows={3}
                />
              ) : (
                <input
                  value={setting.setting_value || ''}
                  onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
                  className="input-field"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('pharmanest_admin') === 'true')
  const navigate = useNavigate()
  const location = useLocation()

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem('pharmanest_admin')
    setIsLoggedIn(false)
    navigate('/admin')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <BsFlower1 className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-sm">PharmaNest</span>
              <span className="block text-xs text-gray-500">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path) || (link.path === '/admin' && location.pathname === '/admin')
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <link.icon />
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2">
            <BsArrowLeft /> Back to Site
          </Link>
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-sm text-red-500 hover:text-red-700 px-4 py-2 mt-1">
            <BsX /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsAdmin />} />
          <Route path="/team" element={<TeamAdmin />} />
          <Route path="/banners" element={<BannersAdmin />} />
          <Route path="/messages" element={<MessagesAdmin />} />
          <Route path="/settings" element={<SettingsAdmin />} />
        </Routes>
      </main>
    </div>
  )
}
