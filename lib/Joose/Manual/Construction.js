/**

NAME
====

Joose.Manual.Construction - Object construction with Joose

WHERE'S THE CONSTRUCTOR?
========================

You do not need to define a constructor method for your classes. Really. Instead, define an `initialize` method. 

When you build a class using Joose it will be managed by the instance of Joose.Meta.Class. This instance (a *metaclass instance*) provides a constructor for you. 
This constructor will perform attributes initialization and then will call a `initialize` method with the same arguments.

However, if you are still sure you need a custom constructor you may provide it using a `constructor` builder:

        Class('User', {
    
            constructor : function (i, really, know, what, iam, doing) {
            }
    
            ....
        })



OBJECT CONSTRUCTION AND ATTRIBUTES
==================================

The Joose-provided constructor accepts an object with properties, matching your attributes. This is just another way in which Joose keeps you from worrying how classes are implemented. 
Simply define a class and you're ready to start creating objects!

        Class('User', {
            isa : Person,
    
            has : {
                password : { init : '12345' },
                lastLogin : { init : function () { return new Date() } }
            }
        })
    
        var user = new User({
            password : 'abcdef',
            lastLogin : 'Yesterday'
        })

If, during construction, you'll provide a function as an initializing value, it will be assigned as-is (not will be called).


NAMESPACES
==========

In Joose, each class also act a namespace with the same name. 

The name of the class can consist from one or several *namespace segments*. The separator symbol is a dot: `.` 
After declaration, Joose translates the class's name to constructor and place it into appropriate namespace. For example:

        Class("MyApp.Point", {
            has: {
                x: {is: "ro"},
                y: {is: "rw"},
            }
        })
        
        Class("MyApp.Point.ThreeD", {
            isa: Point,
            
            has: {
                z: {}
            }
        })

        Class("MyApp", {
            has: {
                name: null
            }
        })
        
        var point = new MyApp.Point()
        var point3d = new MyApp.Point.ThreeD()
        var myapp = new MyApp()

Note, how `MyApp` class was created already after its namespace segment was declared.


`body` BUILDER
==============

Each class also support special builder `body`, which should be a function. 

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
                    }
                })
            }
        })


This function will be called right after class construction, with the class's constructor as 1st argument and in the same scope.

The class will be already fully constructed at the time of `body` execution, you can create its instances or even *extend* it with some additional
methods (see [Joose.Manual.Mutability][1] for details)


AUTHOR
======

Nickolay Platonov [nickolay8@gmail.com](mailto:nickolay8@gmail.com)

Heavily based on the original content of Moose::Manual, by Dave Rolsky [autarch@urth.org](mailto:autarch@urth.org)


COPYRIGHT AND LICENSE
=====================

Copyright (c) 2008, Malte Ubl

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


[1]: Mutability.html

*/