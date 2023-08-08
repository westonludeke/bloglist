import { useState } from 'react';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      {visible && (
        <div style={{ marginTop: '10px' }} className="togglableContent">
          {props.children}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={toggleVisibility}>cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Togglable;
