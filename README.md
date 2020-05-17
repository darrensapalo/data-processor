# Data Processor

A standard data processor that I use for processing CSV files, and the like.

Already comes pre-packaged with:

* `rxjs` for stream-based processing
* `winston` for error logging
* `jaro-winkler` for string evaluation (edit distance)
* `prompts` for retrieving user input

Written in `typescript`

## Sample

Some of the data processing that I do can be found in the `src/programs` folder.

I'll gitignore them later, but I'll keep them here for now. Later I'll move them
to an `examples` folder.

## Project Structure

* `src/programs` - All programs are kept here.
* `logs` - All log files (using Winston) will be kept in this directory.
* `data-source` Data files (csvs, etc.) should be kept here.
