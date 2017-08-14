module.exports = {
  helloWorld: `
    ReactDOM.render(
      <NaiveRender
      >
        <h1>Hello, world!</h1>
      </NaiveRender>,
      document.getElementById('helloWorld')
    );
  `,
  EchoInput: `
    const onValueChange = ({ state }) => {
      stateTree.set('name.value', state.value)
      console.log(stateTree.get('name.value'))
    }
    ReactDOM.render(
      <Render
        stateTree={stateTree}
        appearance={appearance}
        background={background}
      >
        <div>
          <h1>所见即所得</h1>
          <C.Input bind="name"
            getInitialState={() => ({ label: 'name', value: 'default value' })} 
            listeners={{ onChange: { fns: [{fn: onValueChange }]} }}
          />
          <h2>展示区</h2>
          <C.Input 
            getInitialState={() => ({ value: stateTree.get('name.value')})}
          />
        </div>
      </Render>,
      document.getElementById('EchoInput'),
    )
    `,
  todoApp: `
    `,
  formValidation: `
    const { Input, Button } = components
    const validators = {
      notEmpty({ state }) {
        const isValid = state.value.trim() !== ''
        return {
          type: isValid ? 'success' : 'error',
          help: isValid ? '' : '不能为空',
        }
      },
    }
    ReactDOM.render(
    <NaiveRender
    >
      <div>
        <h3>自校验</h3>
        <Input bind="name" getInitialState={() => ({ label: '姓名' })} validator={{ onChange: [{ fn: validators.notEmpty }] }} />
      </div>
    </ NaiveRender>, document.getElementById('formValidation'))
  `,
  helloWorldConfig:
  `
// 1. config 配置方式写组件
const config = {
  children: [{
    type: 'Input',
    getInitialState: () => ({
      placeholder: '在此输入',
    }),
    bind: 'input',
    listeners: {
      onChange: {
        fns: [{
          fn({ state, stateTree }) {
            stateTree.set('input.value', state.value)
          },
        }],
      },
    },
  }, {
    type: 'div',
    interpolation: true,
    children: ['Hello World: \${stateTree.get("input.value")}'],
  }],
}
const baseComponents = {...components}
ReactDOM.render(
  <NaiveRender
    config={config}
    components={baseComponents}
  />,
  document.getElementById('helloWorldConfig'),
)
  `,
  helloWorldDefault:
  `
// 2. 传统方式写组件
const { Input, Box } = components
ReactDOM.render(
  <NaiveRender
  >
    <Input bind="name" getInitialState={() => ({ placeholder: '在此输入'})} />
    <Box interpolation>{'Hello World: \${stateTree.get("name.value")}'}</Box>
  </ NaiveRender>,
  document.getElementById('helloWorldDefault'),
)
`,

}

