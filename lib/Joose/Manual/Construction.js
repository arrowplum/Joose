/**

NAME
====

Joose.Manual.Construction - Object construction with Joose

WHERE'S THE CONSTRUCTOR?
========================

You do not need to define a constructor method for your classes. Really. Joose provides your classes with the default constructor which will initialize the attributes of your class.
Instead, define the `initialize` method, which will be called after all attributes were initialized.


OBJECT CONSTRUCTION AND ATTRIBUTES
==================================

The Joose-provided constructor accepts an object with properties, matching your attributes. This is just another way in which Joose keeps you from worrying how classes are implemented. 
Simply define a class and you're ready to start creating objects!

        Class('User', {
            isa : Person,
    
            has : {
                username : { init : 'nobody' },
                password : { init : '12345' },
                lastLogin : { init : function () { return new Date() } }
            },
            
            after : {
                initialize : function (props) {
                    if (props.custom == '...') { ... }
                } 
            }
        })
    
        var user = new User({
            password : 'abcdef',
            lastLogin : 'Yesterday',
            
            custom  : 'custom'
        })

If, during *construction*, you'll provide a function as an initializing value, it will be assigned as-is (will not be called).



THE INSTANTIATION WORKFLOW
==========================

`new constructor(property1, property2)`

>`var attrs = this.BUILD(property1, property2)`

>`return this.initialize(attrs) || this`

When you building a class with Joose, it provides a *default constructor* for you. This constructor will perform some low-level initialization and then will call a `BUILD` method with the same arguments.

`BUILD` method should return an object, which properties directly corresponds to class attributes - they will be used to initialize them.

**Important**: The order of attributes initialization is *not defined*. You shouldn't rely on it. If you need to initialize some attribute after another, consider to use [lazy attributes](http://samuraijack.github.com/JooseX-Attribute/doc/html/JooseX/Attribute/Lazy.html)  

Default `BUILD` method just checks whether the 1st arguments passed to it is an `Object`, if so - its returned.

The object, returned from `BUILD` method is passed to `initialize`. In turn, if `initialize` method will return something, 
that value will be returned from constructor, otherwise the instance itself will be returned. 

If you inherit from parent class, you need to call the inherited `initialize`. You may just define an `after` modifier (see above for an example).


CUSTOM PARAMETERS TO CONSTRUCTOR
================================

If you need to pass the parameters to constructor in another way, override the `BUILD` method, and "normalize" the parameters. 
For example, lets imagine we need to define the `User` class, which will accept the `username` as 1st argument to constructor and `password` as 2nd:

        var user = new User('root', 'foobar') 
        
Then we need to provide the following `BUILD` method:        
        
        Class('User', {
        
            ...
                        
            methods : {
                BUILD : function (usr, pwd) {
                    return {
                        username : usr,
                        password : pwd
                    }
                }
            }
            
            after : {
                initialize : function (props) {
                    if (props.username == '...') { ... }
                } 
            }
        })
    


NAMESPACES
==========

In Joose, each class also act a namespace with the same name. 

The name of the class can consist from one or several *namespace segments*. The separator symbol is a dot: `.` 
After declaration, Joose translates the class's name to constructor and place it into appropriate namespace.
You don't need to manually pre-create the namespace for your class - just go ahead. For example:

        Class("MyApp.Point", {
            has: {
                x: {is: "ro"},
                y: {is: "rw"},
            }
        })
        
        var point = new MyApp.Point()
        
        
        Class("MyApp.Point.ThreeD", {
            isa: Point,
            
            has: {
                z: {}
            }
        })

        var point3d = new MyApp.Point.ThreeD()
        
        
        Class("MyApp", {
            has: {
                name: null
            }
        })
        
        var myapp = new MyApp()

Note, how `MyApp` class was created already *after* its namespace segment was declared. This is a perfectly valid declaration.


NESTING NAMESPACES
==================

Each class also support special builder `body`, which should be a function. This function will be called right after class construction, with the class's constructor as 1st argument and in the same scope. 
 
You may declare new classes (or roles) in the `body`. Such class's constructor will be placed in the namespace of the outer class. If you need to declare the class in the global namespace from `body`, then
prefix its name with dot:  

        Class("MyApp.Point", {
            
            body : function (myAppPoint) {
                console.log(myAppPoint == MyApp.Point) //prints 'true'
                
                console.log(this == MyApp.Point) //prints 'true'
                
                ...
            
                // nested class
                Class("ThreeD", {
                    isa: MyApp.Point,
                    
                    has: {
                        z: {}
                    }
                }
                
                // class in global namespace
                Class(".MyApp.Circle", {
                    has: {
                        radius: {}
                    }
                }
            }
        })
        
        var point       = new MyApp.Point()
        var point3d     = new MyApp.Point.ThreeD()
        var circle      = new MyApp.Circle()


The class will be already fully constructed at the time of `body` execution, you can create its instances or even *extend* it with some additional
methods (see [Joose.Manual.Mutability][1] for details)


        Class("MyApp.Point.ThreeD", {
            isa: Point,
            
            has: {
                z: {}
            },
            
            body : function (myAppPoint3D) {
                console.log(myAppPoint3D == MyApp.Point.ThreeD) //prints 'true'
                
                console.log(this == MyApp.Point.ThreeD) //prints 'true'
                
                ....
                
                var private = new MyApp.Point.ThreeD({ x: 1, y : 2, z: 3})
                
                ....
                
                MyApp.Point.ThreeD.meta.extend({
                    methods : {
                        additionalMethod : function () {}
                    }
                })
            }
        })

**NOTE:** `body` builder is a correct place to perform some action after creation of class, because in general case, the creation may be asynchronous (for dependency loading for example).



MODULES
=======

Modules are classes, which consists from the `body` only. Modules may not be instantiated. `Module` helper also can be called with `body` as 2nd argument directly: 

        Module("MyApp", function () {
        
            Module("Point", function () {
            
                Class("ThreeD", {
                    isa: Point,
                    
                    has: {
                        z: {}
                    }
                }
            })
        })
        
        var myapp = new MyApp() //exception, modules can't be instantiated
        
        var point3d = new MyApp.Point.ThreeD() //ok

Its possible to "promote" Module to Class.
 
        //promoting Module to class
        Class("MyApp", {
            ...
        })
        var myapp = new MyApp() //ok



CUSTOM CONSTRUCTORS
===================

If you are still sure you need a custom constructor you may provide it using a `constructor` builder:

        Class('User', {
    
            constructor : function (i, really, know, what, iam, doing) {
            }
    
            ....
        })




AUTHOR
======

Nickolay Platonov [nickolay8@gmail.com](mailto:nickolay8@gmail.com)

Heavily based on the original content of Moose::Manual, by Dave Rolsky [autarch@urth.org](mailto:autarch@urth.org)


COPYRIGHT AND LICENSE
=====================

Copyright (c) 2008-2010, Malte Ubl, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


[1]: Mutability.html
[modifiers]: MethodModifiers.html

*/
