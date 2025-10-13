import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Share2, ThumbsUp, AlertCircle, Shield, Copy, Bot, Send } from 'lucide-react';

const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [moderationAlert, setModerationAlert] = useState('');
  const [sharePopup, setSharePopup] = useState(null);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I'm your farming assistant. Ask me anything 🌱" }
  ]);

  // Simulated backend fetch (posts)
  useEffect(() => {
    const fetchPosts = async () => {
      const data = [
        {
          id: 1,
          author: 'Rajesh Kumar',
          location: 'Punjab',
          content: 'Successfully implemented drip irrigation. Water usage reduced by 40%!',
          likes: 24,
          comments: ['Great work!', 'Inspiring initiative 👏'],
          category: 'Water Management',
          verified: true,
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          author: 'Priya Sharma',
          location: 'Maharashtra',
          content: 'AI disease detection helped save my tomato crop. Early detection is key!',
          likes: 45,
          comments: ['This is so useful!', 'Which tool did you use?'],
          category: 'Crop Health',
          verified: true,
          timestamp: '5 hours ago'
        }
      ];
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // AI Content Moderation
  const moderateContent = (content) => {
    const harmfulPatterns = ['abuse', 'scam', 'fake', 'cheat'];
    const lowerContent = content.toLowerCase();

    for (let pattern of harmfulPatterns) {
      if (lowerContent.includes(pattern)) {
        return { safe: false, reason: 'Content contains potentially harmful terms' };
      }
    }
    if (content.length < 10) {
      return { safe: false, reason: 'Content too short for meaningful contribution' };
    }
    return { safe: true };
  };

  // Post submission
  const handlePostSubmit = () => {
    const moderation = moderateContent(newPost);
    if (!moderation.safe) {
      setModerationAlert(moderation.reason);
      setTimeout(() => setModerationAlert(''), 3000);
      return;
    }
    const post = {
      id: posts.length + 1,
      author: 'Current User',
      location: 'Your Location',
      content: newPost,
      likes: 0,
      comments: [],
      category: selectedCategory,
      verified: false,
      timestamp: 'Just now'
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setModerationAlert('');
  };

  // Like button
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // Add comment
  const handleAddComment = (postId, comment) => {
    if (!comment.trim()) return;
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    ));
  };

  // Copy share link
  const handleShare = (postId) => {
    navigator.clipboard.writeText(`https://communityhub.com/post/${postId}`);
    setSharePopup(postId);
    setTimeout(() => setSharePopup(null), 2000);
  };

  // Chatbot send message
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    // add user message
    const newMessages = [...chatMessages, { sender: "user", text: chatInput }];
    setChatMessages(newMessages);

    // send to backend
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput })
      });
      const data = await response.json();
      setChatMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { sender: "bot", text: "⚠️ Sorry, server not responding." }]);
    }
    setChatInput('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Users size={32} color="#16a34a" />
            <div>
              <h1 style={styles.title}>Community Hub</h1>
              <p style={styles.subtitle}>Connect, Share, Grow Together</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <Shield size={20} />
            <span>AI-Moderated</span>
          </div>
        </div>

        {/* Create Post */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            <MessageSquare size={20} color="#16a34a" /> Share Your Experience
          </h2>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            <option>General</option>
            <option>Water Management</option>
            <option>Crop Health</option>
            <option>Pest Control</option>
            <option>Market Insights</option>
            <option>Technology</option>
          </select>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your farming insights, success stories, or ask questions..."
            style={styles.textarea}
          />

          {moderationAlert && (
            <div style={styles.alert}>
              <AlertCircle size={16} color="red" />
              <span>{moderationAlert}</span>
            </div>
          )}

          <button onClick={handlePostSubmit} style={styles.button}>
            Post to Community
          </button>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <div key={post.id} style={styles.card}>
            <div style={styles.postHeader}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  <Users size={24} color="#16a34a" />
                </div>
                <div>
                  <h3 style={styles.username}>
                    {post.author} {post.verified && <Shield size={14} color="blue" />}
                  </h3>
                  <p style={styles.meta}>{post.location} • {post.timestamp}</p>
                </div>
              </div>
              <span style={styles.category}>{post.category}</span>
            </div>

            <p style={styles.content}>{post.content}</p>

            {/* Post Actions */}
            <div style={styles.actions}>
              <button onClick={() => handleLike(post.id)} style={styles.actionBtn}>
                <ThumbsUp size={16} /> {post.likes} Likes
              </button>
              <button
                onClick={() => handleAddComment(post.id, prompt("Enter your comment:"))}
                style={styles.actionBtn}
              >
                <MessageSquare size={16} /> {post.comments.length} Comments
              </button>
              <button onClick={() => handleShare(post.id)} style={styles.actionBtn}>
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Share Popup */}
            {sharePopup === post.id && (
              <div style={styles.sharePopup}>
                <Copy size={14} /> Link copied!
              </div>
            )}

            {/* Comments */}
            {post.comments.length > 0 && (
              <div style={styles.comments}>
                {post.comments.map((c, i) => (
                  <p key={i} style={styles.comment}>💬 {c}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chatbot floating button */}
      <div style={styles.chatBotIcon} onClick={() => setChatOpen(!chatOpen)}>
        <Bot size={45} color="white" />
      </div>

      {/* Chatbot window */}
      {chatOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>🌱 AgriBot</div>
          <div style={styles.chatBody}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={msg.sender === "user" ? styles.userMsg : styles.botMsg}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={styles.chatInputArea}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              style={styles.chatInput}
            />
            <button onClick={handleChatSend} style={styles.chatSendBtn}>
              <Send size={30} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Inline CSS (added chatbot styles at bottom) */
const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0fdf4, #e0f2fe)', padding: '20px' },
  wrapper: { maxWidth: '700px', margin: '0 auto' },
  header: { background: '#fff', borderRadius: '15px', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '5px', color: '#16a34a' },
  title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  subtitle: { fontSize: '14px', color: '#666', margin: 0 },
  card: { background: '#fff', borderRadius: '15px', padding: '20px', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
  select: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  textarea: { width: '100%', padding: '10px', minHeight: '70px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  button: { background: '#16a34a', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' },
  alert: { background: '#fee2e2', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' },
  postHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  username: { margin: 0, fontWeight: 'bold' },
  meta: { margin: 0, fontSize: '12px', color: '#666' },
  category: { background: '#dcfce7', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: '#166534' },
  content: { fontSize: '15px', color: '#333', marginBottom: '10px' },
  actions: { display: 'flex', gap: '15px', borderTop: '1px solid #eee', paddingTop: '10px' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#555' },
  sharePopup: { marginTop: '8px', padding: '6px 10px', background: '#e0f2fe', borderRadius: '8px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' },
  comments: { marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid #eee' },
  comment: { fontSize: '14px', color: '#444', marginBottom: '5px' },

  // Chatbot

  chatBotIcon: { 
    position: 'fixed', 
    bottom: '20px', 
    right: '20px', 
    background: '#16a34a', 
    borderRadius: '50%', 
    padding: '15px', 
    cursor: 'pointer', 
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
  },
  chatWindow: { 
    position: 'fixed', 
    bottom: '80px', 
    right: '20px', 
    width: '500px',
    height: '600px',
    marginBottom: '40px',
    background: '#fff', 
    borderRadius: '12px', 
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden'
  },
  chatHeader: { 
    background: '#16a34a', 
    color: 'white', 
    padding: '10px', 
    fontWeight: 'bold' ,
    fontSize: '36px',
  },
  chatBody: { 
    flex: 1, 
    padding: '10px', 
    maxHeight: '450px', 
    overflowY: 'auto', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' ,
    fontSize: '20px',
  },
  chatInputArea: { 
    display: 'flex', 
    borderTop: '1px solid #ddd' 
  },
  chatInput: { 
    flex: 1, 
    padding: '8px', 
    border: 'none', 
    outline: 'none',
    fontSize: '26px', 
  },
  chatSendBtn: { 
    background: '#16a34a', 
    color: 'white', 
    border: 'none', 
    padding: '10px', 
    cursor: 'pointer' 
  },
  userMsg: { 
    alignSelf: 'flex-end', 
    background: '#dcfce7', 
    padding: '6px 10px', 
    borderRadius: '10px', 
    maxWidth: '90%' 
  },
  botMsg: { 
    alignSelf: 'flex-start', 
    background: '#e0f2fe', 
    padding: '6px 10px', 
    borderRadius: '10px', 
    maxWidth: '80%' 
  }
};

export default CommunityHub;
