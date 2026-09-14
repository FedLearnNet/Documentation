# Sample Data

This folder contains minimal demo files for local testing.

## Iris Dataset

This is the classic Iris flower dataset, a well-known benchmark for classification tasks. It contains 150 samples from
three species of Iris flowers (Setosa, Versicolour, and Virginica), with four features measured for each sample: sepal
length, sepal width, petal length, and petal width.

<a href="/documentation/sample-data/iris.csv">Download</a>

## Gene Dataset

This is a sample gene expression matrix, suitable for bioinformatics analyses like differential expression or
clustering. The filename indicates it contains data for 500 genes across 4 samples, with the expression values being
z-score normalized.

<a href="/documentation/sample-data/A.n_genes=500,m=4,std=1,overlap=no.exprs_z.tsv">Download</a>

## Dysregnet Dataset

This collection of files represents a multi-faceted dataset for a Dysregulated Gene Network (Dysregnet) analysis. This
type of analysis is typically used to study differences in gene regulation between two conditions (e.g., case vs.
control).

Clinical: clinical.csv contains clinical information or phenotypes for the samples.

Expression: expr.csv, expr_case.csv, and expr_control.csv are gene expression matrices for all samples combined, and
split into case and control groups, respectively.

Network: grn.csv defines a Gene Regulatory Network (GRN), specifying known interactions between transcription factors
and their target genes.

Metadata: meta.csv contains metadata about the samples or the experimental design.

Interactions: HTRIdb_data.csv provides prior knowledge on transcription factor-gene interactions, likely sourced from
the Human Transcriptional Regulation Interactions database (HTRIdb).

<a href="/documentation/sample-data/dysregnet/clinical.csv">Clinical CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/expr.csv">Expr CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/expr_case.csv">Expre case CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/expr_control.csv">Expr control CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/grn.csv">GRN CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/meta.csv">Meta CSV Download</a> \
<a href="/documentation/sample-data/dysregnet/HTRIdb_data.csv">HTRIdb CSV Download</a>

## Spycone Dataset

This dataset is designed for the time-series analysis of gene expression, possibly within the 'Spycone' analysis
framework. The files suggest a study related to viral infections like influenza and rhinovirus.

Time-Series Data: flu_ts.csv contains time-series gene expression data, likely from an influenza infection study.

Gene Lists: gene_list.csv and symbs.csv provide lists of gene identifiers or symbols used in the analysis.

Normalized Data: normticonerhino_wide.csv is a normalized, wide-format data table, possibly from a rhinovirus infection
experiment.

<a href="/documentation/sample-data/spycone/flu_ts.csv">Flu TS CSV Download</a> \
<a href="/documentation/sample-data/spycone/gene_list.csv">Gene list CSV Download</a> \
<a href="/documentation/sample-data/spycone/normticonerhino_wide.csv">normticonerhino_wide CSV Download</a> \
<a href="/documentation/sample-data/spycone/symbs.csv">Symbs CSV Download</a> 