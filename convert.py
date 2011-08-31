#!/usr/bin/env python

import sys
import json

def main():
   fp = open('macbeth.txt')
   
   try:
      lines = fp.read().split('\n')
   finally:
      fp.close()
   
   index = { }
   
   number = 0
   
   for line in lines:
      for word in line.split(' '):
         number += 1
         
         word = ''.join([x for x in word.lower() if x.isalpha()])
         
         if word != '':
            if word not in index:
               index[word] = [ ]
         
            index[word].append((number, line))
   
   for word in index.keys():
      fp = open('db/%s.json' % word, 'w')
      fp.write(json.dumps(index[word]))
      fp.close()
      

if __name__ == "__main__":
   sys.exit(main())