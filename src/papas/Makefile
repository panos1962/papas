EXEC = ./papas.exe
OBJS = global.o main.o papas.o

TRIES = 10
TRIES = 10000000

$(EXEC): $(OBJS)
	cc -o $(EXEC) $(OBJS)

test: $(EXEC)
	$(EXEC) -n $(TRIES) 3 4
	$(EXEC) -c -n $(TRIES) 3
	$(EXEC) -c -n $(TRIES) 4
	$(EXEC) -n $(TRIES) 4 3

cleanup:
	@rm -f $(EXEC) $(OBJS)
