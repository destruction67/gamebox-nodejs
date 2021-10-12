try {
    req.flash('upload_message', 'CSV import success');
    importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
	res.redirect('/');
    }
    catch (error) {
        next(error);
    }




    importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename, (err, data) =>{
        if (!err) {
        req.flash('upload_message', 'CSV import success');
	    res.redirect('/');
        } else {
        console.log(err);
        }

    });
