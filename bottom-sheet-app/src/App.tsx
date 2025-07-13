import React from 'react';
import BottomSheet from './components/BottomSheet';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>React Bottom Sheet</h1>
      <p>Click the buttons below or drag the sheet to see spring motion with snap points.</p>
      <BottomSheet />
    </div>
  );
}

export default App;
