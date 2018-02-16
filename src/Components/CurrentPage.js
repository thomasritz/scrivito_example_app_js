import * as React from 'react';
import * as Scrivito from 'scrivito';
import Helmet from 'react-helmet';

function CurrentPage() {
  return (
    <CurrentPageErrorBoundary>
      <Scrivito.CurrentPage />
    </CurrentPageErrorBoundary>
  );
}

class CurrentPageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasError: '' };
  }

  componentDidCatch(_error, _info) {
    this.setState({ hasError: Scrivito.currentPage().id() });
  }

  render() {
    console.log('this.state.hasError', this.state.hasError);
    console.log('Scrivito.currentPage().id()', Scrivito.currentPage() && Scrivito.currentPage().id());
    console.log('check', !Scrivito.currentPage() || this.state.hasError !== Scrivito.currentPage().id());
    if (!Scrivito.currentPage() || this.state.hasError !== Scrivito.currentPage().id()) {
      return this.props.children;
    }

    return (
      <React.Fragment>
        <section
          className="bg-dark-image full-height"
          style={ { background: 'no-repeat center / cover', backgroundImage } }
        >
          <div className="container">
            <div className="text-center"><h1 className="hero-bold">Sorry</h1></div>
            <div className="text-center">
              <h2 className="hero-small">Something went wrong.</h2>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={ () => window.location.reload(true) }
              >
                Please try again<i className="fa fa-angle-right fa-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
        <Helmet meta={ [{ name: 'prerender-status-code', content: '500' }] } />
      </React.Fragment>
    );
  }
}

const backgroundImage = [
  'linear-gradient(rgba(46, 53, 60, 0.7), rgba(46, 53, 60, 0.7))',
  'url(https://unsplash.com/photos/wapAWmqpBJw/download)',
].join(', ');

export default CurrentPage;
