awk '{
    line = tolower($0);
    count = gsub(/failed/, "", line);
    printf "Number of errors on line %d is %d\n", NR, count
}' ./tmp/responses.txt
