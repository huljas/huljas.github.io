---
layout: post
title: Searching for the perfect DAO pattern
category: code
tags: [java,design]
---

I really liked the way the database access was simplified to static methods in the data object in [Play framework version 1.x](http://www.playframework.com/documentation/1.2.5/jpa):

    MyModel found = MyModel.findById(id);

I wanted to achieve something similar in my current project. My starting point was a common helper class which contained the database specific implementation:

    class DatabaseHelper {
        public static <T> findById(String id, Class<T> type) {...}
    }

    MyModel found = DatabaseHelper.findById(id, MyModel.class);

Static methods
--------------

My first attempt was a base class with static methods:

    class BaseModel {
        public static BaseModel findById(String id) {
            return DatabaseHelper.findById(id, getType());
        }
    }

So now I would only have to implement the `getType` with reflection and be done with it. Well easier said than done. Since the static context of the base class has no knowledge of the implementing class I have no way of getting that class with reflection. In play 1.x this was done with runtime code generation which I don't want to use because of its drawbacks.

Okay so maybe I could use generics somehow?

    class BaseModel<T extends BaseModel> {
        public static T findById(String id) {
            return DatabaseHelper.findById(id, getType());
        }
    }

Well this doesn't even compile because the type variable `T` cannot be accessed from the static context since it has no knowledge of the actual instance of the class defining the type argument.

Normal base class
-----------------

Since static methods are out of the question what could we do with a base class with non-static methods?

    class BaseModel {
        public BaseModel findById(String id) {
            return DatabaseHelper.findById(id, getClass());
        }
    }

    class MyModel extends BaseModel {}

    MyModel found = (MyModel) new MyModel().findById(id);

We can get rid of the cast with generics

    class BaseModel<T extends BaseModel> {
        public T findById(String id) {
            return DatabaseHelper.findById(id, getClass());
        }
    }

    class MyModel extends BaseModel {}

    MyModel found = new MyModel().findById(id);

Sort of there but I still don't want to create a new instance of my model.

Encapsulation to the rescue
---------------------------

Okay so since direct inheritance is out of the question maybe we could use encapsulation somehow?

    class BaseModel {}

    class BaseDAO<T extends BaseModel> {

        private final Class<T> type;

        public BaseDAO(Class<T> type) {
            this.type=type;
        }

        public Class<T> getType() {
            return type;
        }

        public T findById(String id) {
            return DatabaseHelper.findById(id, type);
        }
    }

    class MyModel extends BaseModel {
        public static final BaseDAO<MyModel> DAO = new BaseDao<>(MyModel.class);
    }

    MyModel found = MyModel.DAO.findById(id);

For a finishing touch lets get rid of type parameter with some reflection:

    class BaseDAO<T extends BaseModel> {

        public BaseDAO() {
            this.type = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        }

    }

    class MyModel extends BaseModel {
        public static final BaseDAO<MyModel> DAO = new BaseDao<>();
    }

And with this and some code in our class we get what we wanted:

    class MyModel extends BaseModel {
        private static final BaseDAO<MyModel> DAO = new BaseDao<>();

        public static MyModel findById(String id) {return DAO.findById(id);}
    }

    MyModel found = MyModel.findById(id);

Happiness!