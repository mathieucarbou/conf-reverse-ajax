== How to setup samples ==

First edit your Maven settings.xml file to add Mycila snapshot repository to get latest Soecket.IO-Java libraries. You'll find all necessary information here: http://code.google.com/p/mc-repo/

Then get the samples and build them:

    git clone git://github.com/Ovea/conf-reverse-ajax.git
    cd conf-reverse-ajax
    mvn clean install

Now you can open your IDE and run in each module the *Sample main class in src/test/java of each module to start the sample you want.
