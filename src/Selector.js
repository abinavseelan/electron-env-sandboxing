import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import { Container } from './styles';

import evaluations from './evaluations';

class Selector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluations: [...evaluations],
      query: 'shoes',
    };

    ipcRenderer.on('evaluation-complete', (event, data) => {
      this.setState((prevState) => ({
        ...prevState,
        evaluations: prevState.evaluations.map((evaluation, index) => {
          if (index == data.evaluationId) {
            return {
              ...evaluation,
              completed: true,
              rating: data.rating,
            }
          }

          return evaluation;
        }),
      }))
    });
  }

  handleEvaluation = (e) => {
    const { id } = e.target.dataset;
    const { landingUrl, sessionId, env } = this.state.evaluations[id];

    ipcRenderer.send('start-evaluation', {
      id,
      env,
      landingUrl,
      sessionId,
    });
  }

  render() {
    return (
      <Container>
        <div className='title'>
          <h2>Query: {this.state.query}</h2>
        </div>
        <div className='row header'>
          <div>Website</div>
          <div>AB Experiment</div>
          <div>Rating</div>
          <div></div>
        </div>
        {
          this.state.evaluations.map((evaluation, index) => (
            <div className='row' key={index}>
              <div>
                {evaluation.env}
              </div>
              <div>
                {evaluation.sessionId ? 'Yes' : 'No'}
              </div>
              <div>
                {evaluation.rating || 'Pending'}
              </div>
              <div>
                <button data-id={index} onClick={this.handleEvaluation}>
                  {evaluation.completed ? 'Re-evaluate' : 'Start Evaluation'}
                </button>
              </div>
            </div>
          ))
        }
      </Container>
    );
  }
}

export default Selector;
