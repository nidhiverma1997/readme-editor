import './App.css';
import { Fragment, useReducer, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import templateStrings from './templateStrings';

function App() {
  const initialState = {
    value: '',
    sectionsArray: [],
    output: '',
    sections: [],
    focusedSection: null,
  };

  const sectionTitles = {
    documentation: 'Documentation',
    acknowledgements: 'Acknowledgements',
    contributing: 'Contributing',
    apiReference: 'API Reference',
    liscense: 'License',
  };
  const [togglePreview, setTogglePreview] = useState(true);

  function stateReducer(state, action) {
    switch (action.type) {
      case 'updateValue':
        return {
          ...state,
          value: action.payload,
        };
      case 'updateArray':
        return {
          ...state,
          sectionsArray: [...state.sectionsArray, state.value],
        };
      case 'updateCustomInput':
        let index = state.sections.findIndex(
          (section) => section === state.focusedSection
        );

        return {
          ...state,
          sectionsArray: state.sectionsArray.splice(index, 1, state.value),
        };
      case 'updateOutput':
        return {
          ...state,
          output: state.sectionsArray.join('\n'),
        };
      case 'updateSections':
        return {
          ...state,
          sections: [...state.sections, action.payload],
        };
      case 'setFocusedSection':
        return {
          ...state,
          focusedSection: action.payload,
        };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <Fragment>
      <div className='grid grid-cols-5 gap-4 pt-2'>
        <div className='pl-8'>
          <h4 className='py-4 text-blue-500 font-semibold'>Sections</h4>
        </div>
        <div className='col-span-2'>
          <h4 className='py-4 text-blue-500 font-semibold'>Editor</h4>
        </div>
        <div className='col-span-2'>
          <button
            className='py-4 text-blue-500 font-semibold focus:outline-none outline-none hover:text-blue-700 cursor-pointer'
            onClick={() => setTogglePreview(true)}
          >
            Preview
          </button>
          <button
            className='pl-4 py-4 text-gray-500 font-semibold focus:outline-none outline-none hover:text-gray-700 cursor-pointer'
            onClick={() => setTogglePreview(false)}
          >
            Raw
          </button>
        </div>
      </div>
      <div className='grid grid-cols-5 gap-4'>
        <div className='flex w-full h-3/4 px-8 pt-4 overflow-y-scroll'>
          <ul className='list-none space-y-4 w-full h-full'>
            {Object.keys(sectionTitles).map((key) => (
              <li>
                <button
                  className='bg-white px-4 py-2 w-full shadow cursor-pointer rounded-md'
                  onClick={() => {
                    dispatch({
                      type: 'updateValue',
                      payload: templateStrings[key],
                    });
                    dispatch({ type: 'updateArray' });
                    dispatch({ type: 'updateOutput' });
                    dispatch({
                      type: 'updateSections',
                      payload: key,
                    });
                    dispatch({
                      type: 'setFocusedSection',
                      payload: key,
                    });
                  }}
                >
                  {sectionTitles[key]}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='col-span-2 h-11/12'>
          <textarea
            className='bg-black text-white p-8 overflow-y-scroll w-full'
            autoFocus
            rows={20}
            value={state.value}
            onChange={(e) => {
              dispatch({ type: 'updateValue', payload: e.target.value });
              dispatch({ type: 'updateCustomInput' });
              dispatch({ type: 'updateOutput' });
            }}
          />
        </div>
        <div className='col-span-2 h-11/12 mr-8'>
          {togglePreview === true ? (
            <MDEditor.Markdown
              source={state.output}
              className='p-8 rounded-md w-full h-3/4 border-2 border-gray-200 overflow-y-scroll'
            />
          ) : (
            <div className='p-8 rounded-md w-full h-3/4 border-2 border-gray-200 overflow-y-scroll'>
              {state.sectionsArray.map((section, key) => (
                <div className='pb-4' key={key}>
                  {section.split('\n').map((line) => (
                    <p>{line}</p>
                  ))}
                  <br />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default App;
