const API_ENDPOINT = '/api'; // This should be replaced by your AWS location

/*
 our todos will have the following form:

 { task: 'write this website', state: 'completed', pk: 1 }

 pk is used to be able to update the database
*/

const app = Vue.createApp({
  delimiters: ['[%', '%]'],
  data() {
    return {
      todos: [{ task: 'write the website', state: 'incomplete' }, { task: 'write the django backend', state: 'incomplete' }],
    }
  },
  created() {
    fetch(`${API_ENDPOINT}`)
      .then(response => response.json())
      .then(data => {
        const parsedData = JSON.parse(data.data);
        this.todos = parsedData.map(todo => {
          return {
            task: todo.fields.task,
            state: todo.fields.state,
            pk: todo.pk,
          }
        });
      })
      .catch(e => console.log(e));
  },
  methods: {
    toggleComplete(todo) {
      todo.state = todo.state == 'complete' ? 'incomplete' : 'complete'; // simple switch of the state to the opposite state
    }
  }
});

const vm = app.mount('#app');