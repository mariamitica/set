import random
import json
import os
def get_additional_cards_no_set(): 
    # print "session cards (no set):" + ",".join(session.cards)  
    # print "new set cards (no set):" + ",".join(session.noSetCards)
    if len(session.noSetCards) > 0:
        for card in session.noSetCards:
          session.cards.remove(card)
        session.noSetCards = []  

    return json.dumps(generate_additional_cards('no-set'))

def get_additional_cards_set():
    # print "session cards(set):" + ",".join(session.cards)  
    for card in request.post_vars['set[]']:
      session.cards.remove('cards/' + card + '.html')
    return json.dumps(generate_additional_cards('set'))

def generate_additional_cards(usecase):
    additional_cards = []
    # print len(session.cards)
    if len(session.cards) < 12 or usecase == 'no-set':
        while len(additional_cards) < 3:
            file_name = 'cards/' + str(random.randrange(0,3,1)) + '-' + str(random.randrange(0,3,1)) + '-' + str(random.randrange(0,3,1)) + '-' + str(random.randrange(1,4,1)) + '.html'
            if file_name not in session.cards:
                session.cards.append(file_name)
                if request.post_vars['style'] == 'no-set':
                    session.noSetCards.append(file_name)
                additional_cards.append(open(os.path.join(request.folder, 'views', file_name)).read())
    # print "session cards(gen):" + ",".join(session.cards)
    # print "new set cards (gen):" + ",".join(session.noSetCards)
    return additional_cards        

def check_no_set():
    set = []
    cards = []
    possible_set = []
    contor = 1
    for card in session.cards:
        cards.append(card.split('cards/')[1].split('.html')[0])
    for i in range(len(cards)):
        for j in range(i + 1, len(cards)):
            possible_match = check_two_cards(cards[i], cards[j])
            contor = contor + 1
            if possible_match in cards:
                print 'existing possible match: ' + possible_match
                possible_set.append(cards[i])
                possible_set.append(cards[j])
                possible_set.append(possible_match)
                break
        if len(possible_set) > 0:
            break
    return json.dumps(possible_set)

def check_two_cards(card1, card2):
    print 'card1: ' + card1 + ' card2: ' + card2
    card1 = card1.split('-')
    card2 = card2.split('-')
    
    # print card2
    card_match = []
    for i in range(len(card1)):
        if card1[i] == card2[i]: 
            card_match.append(card1[i])
        else:
            if i == 3:
                card_match.append(list(set(['1', '2', '3'])- set([card1[i], card2[i]]))[0])
            else:
                card_match.append(list(set(['0', '1', '2']) - set([card1[i], card2[i]]))[0])
    return '-'.join(card_match) if card_match != [] else []