# tinjector

NOTE: tinjector is still in early development and is not ready for production use

### How to install

`npm install tinjector`

### Why use TypeScript abstract classes instead of interfaces?

TypeScript's interfaces are not represented at runtime in any way. Even using reflect-metadata their types are return as Function or Object instead of the interface types. Abstract classes are represented at runtime so we can infer their types and build the dependency tree. This is the most backwards compatible approach in the case that TypeScript eventually supports interfaces as more than just type declarations.

### Getting started

In your app's entry file import the container from tinjector:

`import {container} from "tinjector"`

You can then register your "interfaces" to your implementations:

`container.registerAbstract(IPersonService, PersonService)`

You can chain registrations and declare them as singletons by supplying `true` as the third parameter:

`container.registerAbstract(IPersonService, PersonService).registerAbstract(IPersonRepository, PersonRepository, true);`

To register a class without a backing interface you can `registerClass` and provide it the singleton override as well if needed:

`container.registerClass(PersonService)`

To resolve dependencies you need to decorate your class with the `@inject` decorator supplied by tinjector.

```typescript
import {inject} from "tinjector";

@inject
class MyConsumer  {
  private readonly personService: IPersonService;
  constructor(personService: IPersonService) {
    this.personService = personService;
  }
}
```

inject will automatically resolve the parameter types and inject the required dependencies provided they are registered properly in the IoC container.
