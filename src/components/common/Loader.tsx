import './Loader.scss'

export function Loader({ size = '2rem' }: { size?: string }) {
  return (
    <div className="loader" style={{ width: size, height: size }}>
      <span className="circle" />
      <span className="circle" />
      <span className="outer-ring" />
      <span className="outer-ring" />
      <span className="outer-ring" />
      <span className="outer-ring" />
    </div>
  )
}
