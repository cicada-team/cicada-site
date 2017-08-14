---
title: 设计理念
description: Nothing to see here
group: HOW IT WORKS
index: [1, 1]
---

## 为什么要用 Cicada？

### 数据驱动

在数据驱动的大背景下，前端应用框架的问题实际上只有一个：数据管理。不论是 React 还是 Redux，都提出了自己对数据管理的概念，React 的组件之间通过 prop 和 state 来实现数据通信，最后利用 Render 来渲染变化的页面。Redux 提出了 action，reducer， store 的概念，并且让数据永远保持单向的通信方式，从而定义了一套数据通信的规范。这里的数据，既可以是组件数据（包括组件的状态和属性，比如输入框的 value、placeholder），也可以是业务数据，而管理既包括如何保存数据，也包括以何种方式让用户来读写数据。我们这里定义好了数据管理对框架的需求之后，就需要知道一个框架该如何更好的和数据打交道。

我们从业务的角度出发，来探讨数据管理对框架开发的需求的上限和下限：
*  下限，无非就是最简单的「详情页」和「列表页」，这里只是利用到了数据的展示功能，框架拿到数据后，前端页面该如何更好看的呈现数据。
* 上限，由于前端开发往往是渐进式的开发，我们永远无法知道接下来需求对前端开发提出了怎样的挑战和考验。最好的解决办法就是，在可见的范围内，考虑到未来会发生的情况。对于框架开发的上限而言，应该就是数据的动态设置和获取了。例如我们用 ajax 从后端请求数据，就需要知道数据是以何种结构获取。这种结构是已知的并且可预见的。

由上，我们可以联想到业务当中最复杂的业务场景，来了解数据具体是如何和框架产生联系的：
* 最复杂的业务场景通常包括了大量的交互细节，例如组件状态要和权限结合(例如 按钮的 disable 状态)、组件要根据需求动态显示或隐藏，表单的校验，异步状态的提示或管理(例如发送请求后，按钮上出现loading)。
* 除了组件数据，还有大量的业务数据要管理，并且是其中有很多联动关系。例如在云计算控制台里面有 ECS、LBS 等概念，ECS 和 LBS 有关联关系，ECS如果改名了。不仅要更新ECS自己的详情显示，还要自动更新关联的LBS的显示等。

我们把数据按使用场景来区分，就得到了和交互紧密相关的组件数据（比如 display 属性，字体颜色属性），以及和业务本身相关的业务数据（通常用来处理前端页面的交互逻辑）。我们来看下面一段代码：
```js
// 用户点击按钮，发送 ajax 请求到后台，直到数据返回之前，按钮属于不可使用状态（disabled）
function submitForm({ stateTree }){
  stateTree.set('submit', {disabled: true}) // 为了防止重复提交
  ajax({
    url : 'xxx',
    data: {
      name: stateTree.get('name').value,
      password: stateTree.get('password').value
    }
  }).finally(() => {
      stateTree.set('submit', {disabled: false})
  })
}
```
是不是同时处理了组件数据（ Button 的 disabled 属性）又处理了业务数据（拿到了 name 和 password）？如果按照 React 组件化的思想来理解这段代码，它实现了最小组件单元 Button 的目标：触发 ajax => 拿到数据 => 修改状态，非常直观易懂的设计。但是我们回过头来看前面对于数据的分类，这段代码既处理了业务逻辑又处理了渲染逻辑，当项目到了后期变得膨胀和复杂起来，代码非常不利于维护和测试。

### 建立数据源到组件数据的映射关系

再回到上面案例当中的交互细节：当用户按下 Button 之后，发送请求，Button 就设置为 disable true，一旦有响应返回，就设置为 disabled 为 false。我们会发现，Button 的 disabled 属性实际上和网络请求紧密关联的！他们之前存在一种映射关系，即网络请求的状态直接影响了 Button 的 disabled 属性的变化。

我们再推广到更多的交互场景：
* 异步状态控制，如上面 button 在发请求时要设为 disable 防止重复提交
* 权限控制
* 表单验证状态

不难发现，几乎所有的交互都一定是又内部某个状态的变化而引发的，比如 Input 组件输入为空，就一定会有非空的报错提醒，又或者当用户不具有管理员的权限的时候，在用户管理界面就不会出现删除用户的按钮。

这种映射关系可以写成：
```js
// 发送 ajax
ajax('login', {name: 'xxx', password: 'xxx'})

// ajaxStates 由框架提供，保存着所有的ajax 状态
function mapAjaxToButton({ajaxStates}){ 
  return {
    disabled: ajaxStates.login === 'pending'
  }
}
```

总结来说，我们得到了下面几个概念之间的关系

![RatpXXxLIEZaejNQynnK.png](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/18015/a9273a89e82f6c95.png) 


有了上图的关系，我们的框架就能意识到这种映射关系的存在，而用户则无需考虑到数据源和组件数据之间的是如何相互影响的，只需要定义好映射关系和触发规则，就可以实现组件数据和业务数据之间的分离。

### 组件数据和专有领域数据分离

我们到现在还没有提到组件数据的设计，正如前面所说，所有的组件状态是由应用框架保存的。例如，一个 Button 组件所具备的属性有：text、size、loading、type、disable，每一个属性都对应着组件样式的变化和交互的变化。如果框架能够全面意识到组件所具备的属性，就能够灵活的根据业务逻辑去触发相应的交互变化。但是这和我们现实中常见的经验相悖。现实中的组件通常是数据、行为、渲染逻辑三部分写在一起，使用 class 或者工厂方法来创建。如果是全面由框架接管，则应该打散，全部写成声明式。于是我们提出了 [React Lego]() 组件规范。一个符合 React Lego 规范的 Button 组件应该写成下面这种形式：
```js
const TYPES = ['normal', 'primary', 'dashed', 'ghost']

export const getDefaultState = () => ({
  text: '',
  size: SIZES[0],
  loading: false,
  type: TYPES[0],
  disabled: false,
  icon: '',
})

export const stateTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(SIZES),
  loading: PropTypes.bool,
  type: PropTypes.oneOf(TYPES),
  disabled: PropTypes.bool,
  icon: PropTypes.string,
}

export const defaultListeners = {
  onClick: keep,
}

export function render({ state, listeners }) {
  return <Button {...omit(state, 'text')} {...listeners}>{state.text}</Button>
}
```
具体的每个方法和属性的用法我们不在这里一一描述，但从代码中可以看出，与传统的 React 组件不同，React Lego 组件几乎把所有的方法和属性都暴露给了框架本身，由框架去统一管理组件的生命周期和内部状态。而组件本身，不保存任何状态。

对于专有领域数据，我们可以理解成非组件数据外的所有数据，这包括表单数据状态源、异步状态数据源、业务数据源等等。我们在下面的子标题「Background：Util 和 Job」，会介绍专有数据源。

![fYMQMhvVgwPrfyFVbugp.png](https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/skylark/png/18015/ceeda11b4b7108a4.png) 

最后，我们就得到了上面的关系图。



## StateTree 和 Appearance

stateTree 即全局的组件数据源，在一个 Cicada 应用中，通常只存在一个 stateTree 用来保存所有的 React Lego 组件，前面我们已经提到了数据源分开的好处，而作为最核心的数据源，stateTree 具有统一的格式来存储组件状态。stateTree 自身也具备了常见的 getter 和 setter 操作，直接操作组件数据。

所谓术业有专攻，我们针对组件的样式，抽象了一层 appearance 数据源出来，单独处理需要更改样式的组件。


## Background：Util 和 Job

任何一个有一定复杂度、会持续增长的应用最重视的，其实并不是开发速度，而是可维护性和可扩展性。 这也是框架设计者们摆在首位的事情。可扩展性的好坏取决于框架的扩展机制。在我们的上面的设计中需要扩展的有两部分，组件和功能。组件的扩展可以通过允许用户提交自定义组件来实现。功能的扩展主要由框架开发者完成，但是也可以考虑让用户能仿照异步管理数据源一样建立自己专用的数据源来解决业务专有问题。

所以 Cicada 提供了框架层面的扩展机制，我们称之为 utility 工具类插件和 job 任务类插件。工具类插件也可以理解成专有数据源，与业务之间有强联系，比如 validation utility，用户只有在需要用的时候，才需要操作 validation，而框架则通过参数的方式，注入到了用户的逻辑代码当中。任务类插件 job，比如 mapBackgroundoState，是 Cicada 提供的一种数据源对组件数据映射规则，我们来看如下的例子，

```js
function mapInputToButton({ stateTree }){
  if (stateTree.get(name.value) === 'alice') {
  	return {
	  disabled: false
	}
  }
  return {
    disabled: true
  }
}

ReactDom.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
    <Input bind="name" />
	<Button mapBackgroundToState={[mapInputToButton]} />
  </Render>, document.getElementById('root')
)
```
用户在 mapInputToButton 方法里写映射逻辑，即如果 Input 输入框的内容为「alice」，则 Button 组件可选，如果输入框写了其他内容，Button 组件不可选。这里我们形成了一种组件数据源（Input）到组件数据源（Button）的映射关系。而一旦写好之后，用户无需关心何时触发，因为在这个方法里已经定义好了。

## 和其他框架比较
不论是 Redux 还是 Mobox，都是专门用来管理状态树的工具。 Cicada 自身除了实现了一套完备的状态树管理系统之外，更是提供了**一整套的复杂前端页面系统的解决方案**。换句话说，使用 Cicada 可以帮你解决了将来项目变得臃肿和庞大之后，所遇到的问题，比如有效的管理组件交互和组建数据。我们经过长时间的摸索和总结，提供了这一套解决方案。当然，由于 Cicada 构建在 React 之上，适配 React 的第三方库也同样适用于 Cicada，比如 React router，我们也提供了这样的例子。

前端应用开发的最佳实践可以说种类繁多，但毫无疑问，任何一个最佳实践，都一定是为了解决具体某实际问题而存在的。面对同样的问题「如何更好的开发复杂前端应用？」，我们可以使用 React + Redux 或者其他业界认可的最佳实践来完成开发，但我们更应该选择 Cicada，毕竟这是一个经过实践沉淀的用于解决构建复杂前端页面的运行时框架（我们团队内部已经开发和使用近两年时间）。

