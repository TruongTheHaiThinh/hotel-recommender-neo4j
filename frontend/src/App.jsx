import React, { useState, useEffect, useRef } from 'react';
import { Users, Hotel, Star, Search, Database, BarChart3, Loader2, Share2, X, MapPin } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';

const API_BASE_URL = "http://localhost:8000";



function App() {
  const [stats, setStats] = useState({ users: 0, hotels: 0, reviews: 0 });
  const [userId, setUserId] = useState('');
  const [sampleUsers, setSampleUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const graphRef = useRef();

  useEffect(() => {
    fetchStats();
    fetchGraphData();
    fetchSampleUsers();
  }, []);

  const fetchSampleUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sample-users?limit=8`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const users = data.includes("U2457") ? data : ["U2457", ...data.slice(0, 7)];
        setSampleUsers(users);
      } else {
        setSampleUsers(["U2457"]);
      }
    } catch (err) {
      setSampleUsers(["U2457"]);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Lỗi stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph-data?limit=500`);
      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      console.error("Lỗi đồ thị:", err);
    }
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-150);
      graphRef.current.d3Force('link').distance(60);
    }
  }, [graphData]);

  const handleRecommend = async (e) => {
    if (e) e.preventDefault();
    if (!userId.trim()) return;

    setSearching(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/recommend/${userId}`);
      if (!response.ok) throw new Error("Không tìm thấy người dùng");
      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
      setHistory([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 p-4 md:p-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Graph Hotel Explorer
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
          Hệ thống gợi ý thông minh kết hợp Graph Mining và dữ liệu thực tế từ Google Maps.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatCard icon={<Users className="text-blue-400" />} label="Người dùng" value={stats.users} loading={loading} />
        <StatCard icon={<Hotel className="text-emerald-400" />} label="Khách sạn" value={stats.hotels} loading={loading} />
        <StatCard icon={<BarChart3 className="text-purple-400" />} label="Lượt đánh giá" value={stats.reviews} loading={loading} />
      </section>

      {/* Graph */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden mb-16 backdrop-blur-xl shadow-2xl">
        <div className="p-8 border-b border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Share2 className="w-6 h-6 text-blue-400" />
              Khai phá Mạng lưới Quan hệ
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Kết nối thực tế giữa khách hàng và điểm đến</p>
          </div>
          <div className="flex gap-4 bg-zinc-950/50 p-2 rounded-2xl border border-zinc-800/50">
             <div className="flex items-center gap-2 px-3 py-1">
               <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">User</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 border-l border-zinc-800">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Hotel</span>
             </div>
          </div>
        </div>
        <div className="h-[450px] w-full bg-zinc-950/20 relative">
          {graphData.nodes.length > 0 ? (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="id"
              nodeColor={(node) => node.color}
              nodeRelSize={7}
              linkColor={() => "rgba(255, 255, 255, 0.08)"}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.006}
              backgroundColor="transparent"
              width={1152}
              height={450}
              d3AlphaDecay={0.01}
              d3VelocityDecay={0.3}
              cooldownTicks={100}
              onEngineStop={() => graphRef.current.zoomToFit(400)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
              <span className="text-zinc-600 font-medium italic">Đang tải bản đồ tri thức...</span>
            </div>
          )}
        </div>
      </section>

      {/* Search */}
      <section className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl mb-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Search className="w-6 h-6 text-blue-400" />
          Bạn muốn khám phá từ góc nhìn của ai?
        </h2>
        <form onSubmit={handleRecommend} className="flex flex-col md:flex-row gap-4 mb-8 relative z-10">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Nhập mã User (Ví dụ: U2457, U0001...)"
            className="flex-1 bg-zinc-950/80 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-10 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {searching ? <Loader2 className="w-6 h-6 animate-spin" /> : "Phân tích & Gợi ý"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Gợi ý ID:</span>
          {sampleUsers.map((id) => (
            <button
              key={id}
              onClick={() => setUserId(id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${userId === id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-105' : 'bg-zinc-800/50 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-white'}`}
            >
              {id}
            </button>
          ))}
        </div>
        {error && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
          <X className="w-4 h-4" /> {error}
        </div>}
      </section>

      {/* Results */}
      {searching ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-500 animate-pulse">
            <Loader2 className="w-16 h-16 animate-spin mb-6 text-blue-500" />
            <h3 className="text-xl font-bold text-zinc-300">Đang khai phá dữ liệu...</h3>
            <p className="mt-2 text-zinc-500 text-sm">Chúng tôi đang so khớp hàng nghìn quan hệ đồ thị để tìm khách sạn tốt nhất cho bạn.</p>
          </div>
      ) : (
        <div className="space-y-20">
          {history.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-black">Lịch sử đánh giá</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedReview(item)}
                    className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-zinc-800/60 hover:border-zinc-600 transition-all group shadow-xl"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate group-hover:text-blue-400 transition-colors" title={item.hotel_name}>{item.hotel_name}</span>
                      <span className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Bấm để xem chi tiết</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl shrink-0 border border-zinc-800">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-black">{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-black">Khám phá gợi ý</h2>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs font-bold text-zinc-500">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Google Maps</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Graph Engine</div>
              </div>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((item, index) => (
                  <HotelCard 
                    key={index} 
                    name={item.hotel_name} 
                    rating={item.rating} 
                    google_data={item.google_data} 
                    city={item.city}
                    city_match={item.city_match}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-800/50">
                <Hotel className="w-20 h-20 text-zinc-800 mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold text-zinc-600 mb-2">Chưa có dữ liệu phân tích</h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto">Nhập User ID để chúng tôi thực hiện thuật toán Collaborative Filtering và tìm ra những điểm dừng chân lý tưởng nhất.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
      
      <footer className="mt-32 pt-12 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-600 text-sm font-medium">
        <p>© 2026 Graph Hotel Recommendation System • Designed for Excellence</p>
        <div className="flex gap-8">
           <span className="hover:text-zinc-400 transition-colors cursor-pointer">Chính sách bảo mật</span>
           <span className="hover:text-zinc-400 transition-colors cursor-pointer">Tài liệu API</span>
           <span className="hover:text-zinc-400 transition-colors cursor-pointer">Hỗ trợ</span>
        </div>
      </footer>
    </div>
  );
}

function HotelCard({ name, rating, google_data, city, city_match }) {
  const photoUrl = (google_data && google_data.photo_url) 
    ? google_data.photo_url 
    : "https://images.unsplash.com/photo-1629904853716-f0bc54976a2c?q=80&w=800"; // Ảnh placeholder trung tính

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-[2rem] overflow-hidden hover:translate-y-[-8px] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group flex flex-col backdrop-blur-sm">
      <div className="h-56 w-full overflow-hidden relative">
        <img 
          src={photoUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://images.unsplash.com/photo-1566073771259-d37516a80451?q=80&w=800"; 
          }}
        />
        <div className="absolute top-4 right-4 bg-blue-600 shadow-lg shadow-blue-600/40 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-blue-400/50 z-10">
           <Star className="w-3.5 h-3.5 fill-white text-white" />
           <span className="text-sm font-black text-white">{google_data?.rating || "4.5"}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
           <h3 className="text-xl font-black line-clamp-1 text-white group-hover:text-blue-400 transition-colors mb-2">{name}</h3>
           <a 
            href={google_data?.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Khách sạn " + name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-950/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800"
           >
             <Search className="w-3.5 h-3.5" /> Xem trên Maps
           </a>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-5 bg-zinc-900/20 flex-1">
        <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">{city || "Việt Nam"}</span>
              <span className="text-sm text-zinc-300 font-bold">{google_data?.reviews_count?.toLocaleString() || "1,250"} đánh giá</span>
           </div>
           <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(google_data?.rating || 4) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} />
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] text-emerald-500/80 uppercase font-black tracking-widest mb-1">Gợi ý từ Graph</span>
              <div className="flex items-center gap-2">
                <span className="text-lg text-emerald-400 font-black tracking-tight">{rating} <span className="text-xs text-zinc-600 font-bold">/ 5</span></span>
                {city_match && (
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-blue-500/30">Cùng khu vực</span>
                )}
              </div>
           </div>
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
             <span className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter italic">Recommended</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ review, onClose }) {
  const g_data = review.google_data;
  const photoUrl = (g_data && g_data.photo_url) 
    ? g_data.photo_url 
    : "https://images.unsplash.com/photo-1629904853716-f0bc54976a2c?q=80&w=1200";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-[60%] rounded-[3rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-500 flex flex-col overflow-y-auto max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-80 shrink-0 overflow-hidden">
           <img 
            src={photoUrl} 
            alt={review.hotel_name} 
            className="w-full h-full object-cover rendering-auto" 
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1551882547-ff43c63faf7c?q=80&w=1200"; 
            }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent"></div>
           <button onClick={onClose} className="absolute top-6 right-6 bg-zinc-950/80 hover:bg-black text-white p-2.5 rounded-2xl backdrop-blur-xl transition-all border border-zinc-800 hover:scale-110 active:scale-95 z-20">
             <X className="w-5 h-5" />
           </button>
           <div className="absolute bottom-8 left-10 right-10">
              <h2 className="text-4xl font-black text-white leading-tight mb-3 tracking-tighter drop-shadow-2xl">{review.hotel_name}</h2>
              <div className="flex items-center gap-4 mt-1">
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(g_data?.rating || 4) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`} />
                    ))}
                 </div>
                 <a 
                   href={g_data?.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Khách sạn " + review.hotel_name)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[13px] font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 backdrop-blur-md hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 group/tag"
                 >
                   <MapPin className="w-3.5 h-3.5 group-hover/tag:scale-110 transition-transform" />
                   {g_data?.rating || "4.5"} (Google Maps)
                 </a>
              </div>
           </div>
        </div>
        <div className="p-10">
           <h3 className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em] mb-6">Trải nghiệm của khách hàng</h3>
           <p className="text-lg leading-relaxed text-zinc-100 font-medium italic opacity-95 antialiased">
             "{review.review}"
           </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, loading }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] backdrop-blur-md hover:border-zinc-700 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500/0 via-blue-500 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-center gap-5">
        <div className="p-4 bg-zinc-950 rounded-[1.25rem] group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-3xl font-black tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-zinc-800" /> : value.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default App;
