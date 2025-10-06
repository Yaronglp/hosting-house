export function BackgroundEffects() {
  return (
    <>
      {/* Matrix Background Effect */}
      <div className="matrix-bg"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        <div className="particle" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '20%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '30%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '40%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ left: '50%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '60%', animationDelay: '5s' }}></div>
        <div className="particle" style={{ left: '70%', animationDelay: '6s' }}></div>
        <div className="particle" style={{ left: '80%', animationDelay: '7s' }}></div>
        <div className="particle" style={{ left: '90%', animationDelay: '8s' }}></div>
      </div>
    </>
  )
} 