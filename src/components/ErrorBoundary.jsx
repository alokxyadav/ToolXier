import { Component } from 'react'
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e) { console.error(e.message) } // never log user input
  render() { return this.state.failed ? <div role="alert" className="err"><h1>Something went wrong</h1><p>Please reload the page. If it keeps happening, report an issue on GitHub.</p><button onClick={() => location.reload()}>Reload</button></div> : this.props.children }
}
