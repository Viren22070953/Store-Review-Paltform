import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId;

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255, 200, 100, ${particle.opacity})`;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = particle.speedX * -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = particle.speedY * -1;
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home-root {
          min-height: 100vh;
          background-color: #0a0a0f;
          color: white;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .home-canvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-glow,
        .bg-glow-2 {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(100px);
        }

        .bg-glow {
          width: 600px;
          height: 600px;
          top: -120px;
          left: -120px;
          background-color: rgba(245, 166, 35, 0.08);
        }

        .bg-glow-2 {
          width: 500px;
          height: 500px;
          right: -120px;
          bottom: -120px;
          background-color: rgba(80, 227, 194, 0.07);
        }

        .home-content {
          width: 100%;
          max-width: 1100px;
          padding: 40px 20px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .badge {
          display: inline-block;
          margin-bottom: 28px;
          padding: 7px 18px;
          border: 1px solid rgba(245, 166, 35, 0.35);
          border-radius: 20px;
          background-color: rgba(245, 166, 35, 0.12);
          color: #f5a623;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .home-title {
          margin-bottom: 16px;
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 900;
          line-height: 1.05;
        }

        .home-title span {
          color: #f5a623;
        }

        .home-subtitle {
          margin-bottom: 55px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          font-weight: 300;
        }

        .divider {
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .divider-line {
          width: 60px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.18);
        }

        .divider-text {
          color: rgba(255, 255, 255, 0.35);
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .cards-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
        }

        .role-card {
          width: 300px;
          padding: 34px 28px;
          text-align: left;
          cursor: pointer;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.04);
          transition: 0.3s ease;
        }

        .role-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color);
          box-shadow: 0 18px 45px var(--card-shadow);
        }

        .card-icon-wrap {
          width: 54px;
          height: 54px;
          margin-bottom: 20px;
          border-radius: 14px;
          background-color: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .card-role {
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
        }

        .card-desc {
          margin-bottom: 28px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 13px;
          font-weight: 300;
          line-height: 1.6;
        }

        .card-btn {
          color: var(--card-color);
          font-size: 13px;
          font-weight: 500;
        }

        .card-arrow {
          margin-left: 8px;
          display: inline-block;
          transition: 0.3s ease;
        }

        .role-card:hover .card-arrow {
          transform: translateX(5px);
        }

        .register-link {
          margin-top: 28px;
          color: rgba(255, 255, 255, 0.35);
          font-size: 13px;
          position: relative;
          z-index: 1;
        }

        .register-link a {
          color: #f5a623;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
        }

        .register-link a:hover {
          text-decoration: underline;
        }

        .home-footer {
          margin-top: 60px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 12px;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .home-content {
            padding: 30px 16px;
          }

          .home-subtitle {
            margin-bottom: 40px;
          }

          .role-card {
            width: 100%;
            max-width: 330px;
          }

          .divider-line {
            width: 35px;
          }
        }
      `}</style>

      <div className="home-root">
        <canvas ref={canvasRef} className="home-canvas"></canvas>

        <div className="bg-glow"></div>
        <div className="bg-glow-2"></div>

        <div className="home-content">
          <div className="badge">Store Rating Platform</div>

          <h1 className="home-title">
            Rate Stores,
            <br />
            <span>Share Your Voice</span>
          </h1>

          <p className="home-subtitle">
            A platform where customers rate stores and owners track their reputation.
          </p>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Choose your role to continue</span>
            <div className="divider-line"></div>
          </div>

          <div className="cards-grid">
            <div
              className="role-card"
              style={{
                "--card-color": "#f5a623",
                "--card-shadow": "rgba(245, 166, 35, 0.4)",
              }}
              onClick={() => navigate("/login")}
            >
              <div className="card-icon-wrap">🛍️</div>
              <div className="card-role">User</div>
              <div className="card-desc">
                Browse stores, submit and manage your ratings.
              </div>
              <div className="card-btn">
                Login as User <span className="card-arrow">→</span>
              </div>
            </div>

            <div
              className="role-card"
              style={{
                "--card-color": "#50e3c2",
                "--card-shadow": "rgba(80, 227, 194, 0.4)",
              }}
              onClick={() => navigate("/login")}
            >
              <div className="card-icon-wrap">🏪</div>
              <div className="card-role">Store Owner</div>
              <div className="card-desc">
                View your store's ratings and customer feedback.
              </div>
              <div className="card-btn">
                Login as Store Owner <span className="card-arrow">→</span>
              </div>
            </div>

            <div
              className="role-card"
              style={{
                "--card-color": "#e35050",
                "--card-shadow": "rgba(227, 80, 80, 0.4)",
              }}
              onClick={() => navigate("/login")}
            >
              <div className="card-icon-wrap">⚙️</div>
              <div className="card-role">Administrator</div>
              <div className="card-desc">
                Manage all users, stores and platform settings.
              </div>
              <div className="card-btn">
                Login as Administrator <span className="card-arrow">→</span>
              </div>
            </div>
          </div>

          <div className="register-link">
            New here?{" "}
            <a onClick={() => navigate("/register")}>Create a free account</a>
          </div>
        </div>

        <div className="home-footer">
          © {new Date().getFullYear()} StoreScope - All rights reserved
        </div>
      </div>
    </>
  );
};

export default HomePage;
