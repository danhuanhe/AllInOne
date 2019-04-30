import React, { Component } from 'react';
import { Spin, message } from 'ppfish';
import CodeView from 'react-md-translator';
import 'react-md-translator/style/index.less';
import './demo.less';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    /* componentWillReceiveProps(nextProps) {
        if(nextProps.componentKey !== this.props.componentKey) {
            this.lazyLoad(nextProps.componentKey);
            this.setState({
                isLoading: true
            })
        }
    } */

    componentDidMount() {
        const { componentInfo } = this.props;
        setTimeout(() => {
            this.lazyLoad(componentInfo);
        }, 0);
    }

    lazyLoad(componentInfo) {
        const { belonger, key } = componentInfo;
        let task;
        switch(belonger) {
            case 'qiyu':
                task  = import('../../../qiyu/Components/' + key /*webpackChunkName:"[request]" */);
                break;
            case 'cubex':
                task =  import('../../../cubex/Components/' + key  /*webpackChunkName: "[request]"*/);
                break;
            default:
                task  = import('../../../qiyu/Components/' + key  /*webpackChunkName: "[request]" */);
        }

        task.then((Component) => {
            this.Component = Component;
            this.setState({
                isLoading: false
            });
        }, (error) => {
            message.error(error.message);
        });
    }

    render() {
        if(this.state.isLoading) {
            return (
                <Spin.Container style={{ height: 540 }}>
                    <Spin tip="正在加载..." />
                </Spin.Container>
            );
        }else {
            const { componentInfo } = this.props;
            const { belonger, key, deps } = componentInfo;
            let demoDependencies = {};
            // export default
            if(this.Component.default) {
                demoDependencies[key] = this.Component.default;
            }else {
                demoDependencies = this.Component;
            }
            demoDependencies['deps'] = deps;
            return (
                <div className="demo">
                    <CodeView
                        dependencies={demoDependencies}
                    >
                        {belonger == 'cubex' ?
                            require('../../../cubex/Components/' + key + '/doc.md') :
                        require('../../../qiyu/Components/' + key + '/doc.md')}
                    </CodeView>
                </div>
            );
        }
    }
}
