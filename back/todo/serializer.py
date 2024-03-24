from rest_framework import serializers


from todo.models import TodoItem


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = '__all__'


class TodoItemPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['title', 'description', 'status',
                  'user', 'parent_task']


class TodoListTarefasSerializer(serializers.ModelSerializer):
    subtasks = serializers.SerializerMethodField()

    class Meta:
        model = TodoItem
        fields = ['id', 'title', 'description', 'status',
                  'user', 'parent_task', 'created_at', 'subtasks']  # Inclua 'subtasks' na lista de campos

    def get_subtasks(self, obj):
        subtasks = obj.subtasks.all()
        return TodoListTarefasSerializer(subtasks, many=True).data


class TodoItemDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['id']


class TodoItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['title', 'description', 'status',
                  'user', 'parent_task']
