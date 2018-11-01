import * as React from "react";

import ErrorBoundary from "../ErrorBoundary";
import Footer from "../Footer";

import "./Layout.css";

interface ILayoutProps {
  headerComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
}

class Layout extends React.Component<ILayoutProps> {
  public render() {
    const HeaderComponent = this.props.headerComponent;
    return (
      <section className="Layout">
        <HeaderComponent />
        <main>
          <div className="container">
            <ErrorBoundary>{this.props.children}</ErrorBoundary>
          </div>
        </main>
        <Footer />
      </section>
    );
  }
}

export default Layout;
